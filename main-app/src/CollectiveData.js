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

const CollectiveData = (props) => {

    const [collectiveData, setCollectiveData] = useState(false);
    const [data, setData] = useState({data: []});
    console.log(props.websiteList)
    var startMonth = ("0" + (new Date(startDate).getMonth()  + 1)).slice(-2)
    var endMonth = ("0" + (new Date(endDate).getMonth()  + 1)).slice(-2)
    var startDate = props.startDate
    var endDate = props.endDate
    const mendDate = new Date(endDate).getFullYear().toString() + '-' + startMonth + '-' + ("0" + (new Date(endDate).getDate())).slice(-2)
    const mstartDate = new Date(startDate).getFullYear().toString() + '-' + endMonth + '-' + ("0" + (new Date(startDate).getDate())).slice(-2)

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

    props.websiteList.map(value => {

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
      const labels = await result.data.viewer.zones[0].httpRequests1hGroups.map(value => value.datetime.datetime)
    return (
     <Bar options={options} data={mydata} />
    )
    })

}

export default CollectiveData;