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
const [dataType, setDataType] = useState('PAGEVIEWS_QUERY,Page Views');
const [err, setErr] = useState('');

const handleChange = (event) => {
   console.log(event.target.value)
   setDataType(event.target.value);
};

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
                const TOPIPADDRESS_QUERY = `
                query {
                      	viewer {
                      		zones(filter: { zoneTag: "${value.split(',')[0]}" }) {
                            top100IPs: httpRequestsAdaptiveGroups(
                              filter: {
                                    date_geq: "${mstartDate}",
                					date_leq: "${mendDate}"
                              }
                              limit: 100
                              orderBy: [
                                count_DESC
                              ]
                            ) {
                              count
                			  device: dimensions{device: clientIP}
                      	}
                      }
                      }
                      }
                `;

                const TOPREQUESTSBYCOUNTRY_QUERY = `
                query {
                      	viewer {
                      		zones(filter: { zoneTag: "${value.split(',')[0]}" }) {
                            top10Countries: httpRequestsOverviewAdaptiveGroups(
                              filter: {
                      			date_geq: "${mstartDate}"
                                date_leq: "${mendDate}"
                              }
                              limit: 10
                      				orderBy: [ sum_requests_DESC ]
                            ) {
                      				countryName: dimensions {clientCountryName}
                      				sum { requests }
                      	}
                      }
                      }
                      }
                `;

                const TOP_REFFERERS = `
                query {
                  viewer {
                    zones(filter: { zoneTag: "${value.split(',')[0]}" }) {
                      httpRequestsAdaptiveGroups(
                        filter: {
                          date_geq: "${mstartDate}",
                		  date_leq: "${mendDate}"
                        }
                        limit: 100
                        orderBy: [count_DESC]
                      ) {
                        count
                        avg {
                          sampleInterval
                          __typename
                        }
                        sum {
                          visits
                          __typename
                        }
                        dimensions {
                          metric: clientRefererHost
                          __typename
                        }
                        __typename
                      }
                    }
                  }
                }
                `;

                const TOP_PATHS = `
                query {
                  viewer {
                    zones(filter: { zoneTag: "${value.split(',')[0]}" }) {
                      httpRequestsAdaptiveGroups(
                        filter: {
                          date_geq: "${mstartDate}",
                		  date_leq: "${mendDate}"
                        }
                        limit: 100
                        orderBy: [count_DESC]
                      ) {
                        count
                        avg {
                          sampleInterval
                          __typename
                        }
                        sum {
                          visits
                          __typename
                        }
                        dimensions {
                          metric: clientRequestPath
                          __typename
                        }
                        __typename
                      }
                    }
                  }
                }
                `;

                const TOP_HOSTS = `
                query {
                  viewer {
                    zones(filter: { zoneTag: "${value.split(',')[0]}" }) {
                      httpRequestsAdaptiveGroups(
                        filter: {
                          date_geq: "${mstartDate}",
                		  date_leq: "${mendDate}"
                        }
                        limit: 100
                        orderBy: [count_DESC]
                      ) {
                        count
                        avg {
                          sampleInterval
                          __typename
                        }
                        sum {
                          visits
                          __typename
                        }
                        dimensions {
                          metric: clientRequestHTTPHost
                          __typename
                        }
                        __typename
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

            let Query = PAGEVIEWS_QUERY

            if(dataType.split(',')[0] === 'PAGEVIEWS_QUERY'){
                console.log('in pageviews query')
                Query = PAGEVIEWS_QUERY
            }
            if(dataType.split(',')[0] === 'TOPIPADDRESS_QUERY'){
                console.log('in ipaddress')
                Query = TOPIPADDRESS_QUERY
            }
            if(dataType.split(',')[0] === 'TOPREQUESTSBYCOUNTRY_QUERY'){
                 Query = TOPREQUESTSBYCOUNTRY_QUERY
            }
            if(dataType.split(',')[0] === 'TOP_REFFERERS'){
                Query = TOP_REFFERERS
            }
            if(dataType.split(',')[0] === 'TOP_PATHS'){
                Query = TOP_PATHS
            }
            if(dataType.split(',')[0] === 'TOP_HOSTS'){
                console.log('in http hosts')
                Query = TOP_HOSTS
            }

             const response = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
               method: 'POST',
               headers: authorisationHeaders,
               body: JSON.stringify({ query: Query })
             });

            const result = await response.json();
            console.log(result)
            setData(result);
            setAfterFetchSite(value.split(',')[1]);
            try{
                let labels = ['na']
                let labelData = [ ]
            if(dataType.split(',')[0] === 'PAGEVIEWS_QUERY'){
                labels = await result.data.viewer.zones[0].httpRequests1hGroups.map(value => value.datetime.datetime)
                labelData = await result.data.viewer.zones[0].httpRequests1hGroups.map(value => value.sum.pageViews)
            }
            if(dataType.split(',')[0] === 'TOPIPADDRESS_QUERY'){
                labels = await result.data.viewer.zones[0].top100IPs.map(value => value.device.device)
                labelData = await result.data.viewer.zones[0].top100IPs.map(value => value.count)
            }
            if(dataType.split(',')[0] === 'TOPREQUESTSBYCOUNTRY_QUERY'){
                labels = await result.data.viewer.zones[0].top10Countries.map(value => value.countryName.clientCountryName)
                labelData = await result.data.viewer.zones[0].top10Countries.map(value => value.sum.requests)
            }
            if(dataType.split(',')[0] === 'TOP_REFFERERS'){
                labels = await result.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
                labelData = await result.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count)
            }
            if(dataType.split(',')[0] === 'TOP_PATHS'){
                labels = await result.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
                labelData = await result.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count)
            }
            if(dataType.split(',')[0] === 'TOP_HOSTS'){
                labels = await result.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
                labelData = await result.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count)
            }
            console.log('labels')
            console.log(labels)
            console.log(labelData)
            let mydata = {
              labels: labels,
              datasets: [
                {
                  label: dataType.split(',')[1],
                  data: labelData,
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
                  text: `${dataType.split(',')[1]} for ${value.split(',')[1]}`
                }
              }
            };
            collectiveDataArray.push({
                barOptions: options,
                barData: mydata
            })
            }catch(error){
            console.log(error)
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
                  text: `${dataType.split(',')[1]} for ${value.split(',')[1]}`
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
      Query Type: <select value={dataType} onChange={handleChange}>
                     <option value="PAGEVIEWS_QUERY,Page Views">Page Views</option>
                     <option value="TOPIPADDRESS_QUERY,Top Ip Addresses">Top Ips</option>
                     <option value="TOPREQUESTSBYCOUNTRY_QUERY,Top Countries">Top Countries</option>
                     <option value="TOP_REFFERERS,Page Referrers">Top referrers</option>
                     <option value="TOP_PATHS,Paths">Top Paths</option>
                     <option value="TOP_HOSTS,Hosts">Top Hosts</option>
      </select>
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