import {useState} from 'react';
import React, { Component }  from 'react';
import { format, parseISO } from "date-fns"
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

const NewCollectiveData = (props) => {

const startDate = props.startDate
const endDate = props.endDate
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState({data: []});
const [isAlert, setIsAlert] = useState(false)
const [alertMessage, setAlertMessage] = useState('')
const [afterFetchSite, setAfterFetchSite] = useState('3d.me');
const [dataFetch, setDataFetch] = useState(false);
const [chartData, setChartData] = useState({});
const [site, setSite] = useState('3d.me');
let [collectiveData, setCollectiveData] = useState([]);
const [collectiveDataFetch, setCollectiveDataFetch] = useState(false);
const [err, setErr] = useState('');

const handleCollectiveClick = async () => {
            setIsLoading(true);
            setCollectiveDataFetch(false);
            setCollectiveData([]);
            if(startDate.getTime() > endDate.getTime()){
                setIsAlert(true);
                setAlertMessage('Start Date cannot be greater than end date. Please set it accordingly.');

            }
            else if(((endDate.getTime() - startDate.getTime())/(1000)) >= 259200 ){
                console.log(endDate.getTime() - startDate.getTime())
                setIsAlert(true);
                setAlertMessage('Range cannot be greater than 3 days. Please set it accordingly.');
            }
            else{
            try {
            let collectiveDataArray=[]
            await Promise.all(props.websiteList.map(async(value) => {
             setIsAlert(false);
             setAlertMessage('');
             setIsLoading(true);
             var startMonth = ("0" + (new Date(startDate).getMonth()  + 1)).slice(-2)
             var endMonth = ("0" + (new Date(endDate).getMonth()  + 1)).slice(-2)
             const mendDate = new Date(endDate).getFullYear().toString() + '-' + startMonth + '-' + ("0" + (new Date(endDate).getDate())).slice(-2)
             const mstartDate = new Date(startDate).getFullYear().toString() + '-' + endMonth + '-' + ("0" + (new Date(startDate).getDate())).slice(-2)
             const PAGEVIEWS_QUERY = `
             query {
               viewer {
                 zones(filter: { zoneTag: "${value.split(',')[0]}" }) {
                   httpRequests1hGroups(
                     filter: {
                       date_geq: "${mstartDate}",
             		  date_leq: "${mendDate}"
                     }
                     limit: 1000
                     orderBy: [datetime_DESC]
                   ) {
                     datetime: dimensions{datetime}
                     sum {
                     	pageViews
                     }
                   }
                 }
               }
             }
             `;

             const authorisationToken = "Bearer " + process.env.REACT_APP_authorisation_token;
             const authorisationHeaders = {
                         'X-Auth-Email': process.env.REACT_APP_email_id,
                         'Authorization': authorisationToken,
                         'Content-Type': 'text/plain'
             }

             const response = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
               method: 'POST',
               headers: authorisationHeaders,
               body: JSON.stringify({ query: PAGEVIEWS_QUERY })
             });

            const result = await response.json();
            setData(result);
            setAfterFetchSite(value.split(',')[1]);
            try{
            const labels = await result.data.viewer.zones[0].httpRequests1hGroups.map(value => value.datetime.datetime)
            const mydata = {
              labels: labels,
              datasets: [
                {
                  label: "Page Views",
                  data: await result.data.viewer.zones[0].httpRequests1hGroups.map(value => value.sum.pageViews),
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)"
                }
              ]
            };
            setChartData(mydata);
            setDataFetch(true);
            const options = {
              indexAxis: "x",
              elements: {
                bar: {
                  borderWidth: 2
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  position: "right"
                },
                title: {
                  display: true,
                  text: `Page Views for ${value.split(',')[1]}`
                }
              }
            };
            collectiveDataArray.push({
                barOptions: options,
                barData: mydata
            })
            }catch{
            const labels = ['na']
            const mydata = {
              labels: labels,
              datasets: [
                {
                  label: "Page Views",
                  data: 0,
                  borderColor: "rgb(255, 99, 132)",
                  backgroundColor: "rgba(255, 99, 132, 0.5)"
                }
              ]
            };
            setChartData(mydata);
            setDataFetch(true);
            const options = {
              indexAxis: "x",
              elements: {
                bar: {
                  borderWidth: 2
                }
              },
              responsive: true,
              plugins: {
                legend: {
                  position: "right"
                },
                title: {
                  display: true,
                  text: `Page Views for ${value.split(',')[1]}`
                }
              }
            };
            collectiveDataArray.push({
                barOptions: options,
                barData: mydata
            })
            }

            }));
            setCollectiveData(collectiveDataArray)
            setCollectiveDataFetch(true)
            setIsLoading(false);
            setErr('')
            }
            catch (err) {
                   setErr(err.message);
            } finally {
                   setIsLoading(false);
            }
            }
}

const styleObject = {
      "float": "left",
      "margin": "auto",
      "height" : "40%",
      "width" : "100%"
}

const barObject = {
      "float": "left",
      "margin": "auto",
      "width": "33%"
}

const alertObject = {
      "color": "red"
}

    return (
    <div>
      {err && <h2>{err}</h2>}

      {<button onClick={handleCollectiveClick}>Fetch collective data</button>}
      {isLoading && <h2>Loading...</h2>}
      {isAlert && <h3 style={alertObject}>{alertMessage}</h3>}
      <div style={styleObject}>
      {collectiveDataFetch && collectiveData.map((bar) => (
              <div style={barObject}>
                {<Bar options={bar.barOptions} data={bar.barData} />}
              </div>
      )
      )
      }
      </div>
    </div>
    )
}

export default NewCollectiveData;