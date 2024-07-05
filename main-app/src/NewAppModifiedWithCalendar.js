import {useState} from 'react';
import React, { Component }  from 'react';
import { useQuery } from "react-query";
//import DatePicker from 'react-datetime';
import DatePicker from 'react-date-picker';
//import DatePicker from 'react-datepicker';
//import "react-datepicker/dist/react-datepicker.css";
import "react-date-picker/dist/DatePicker.css";
//import "react-datetime/css/react-datetime.css";
import moment from 'moment';
import { format, parseISO } from "date-fns"
import NewCollectiveData from './NewCollectiveData'

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

const NewAppModifiedWithCalendar = () => {
  const [data, setData] = useState({data: []});
  const [isLoading, setIsLoading] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [dataFetch, setDataFetch] = useState(false);
  const [chartData, setChartData] = useState({});
  const [ipDataFetch, setIPDataFetch] = useState(false);
  const [ipChartData, setIPChartData] = useState({});
  const [topIPData, setTopIPData] = useState({topIPData: []});
  const [err, setErr] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isAlert, setIsAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [value, setValue] = useState('6c57ff46fa3109294beba88a5fbfcbff,3d.me');
  const [site, setSite] = useState('3d.me');
  const [afterFetchSite, setAfterFetchSite] = useState('3d.me');

  const [countryDataFetch, setCountryDataFetch] = useState(false);
  const [countryChartData, setCountryChartData] = useState({});
  const [topCountryData, setTopCountryData] = useState({topCountryData: []});

  const [reffererDataFetch, setReffererDataFetch] = useState(false);
  const [reffererChartData, setReffererChartData] = useState({});
  const [topReffererData, setReffererData] = useState({topIPData: []});

  const [pathDataFetch, setPathDataFetch] = useState(false);
  const [pathChartData, setPathChartData] = useState({});
  const [topPathData, setPathData] = useState({topIPData: []});

  const [hostDataFetch, setHostDataFetch] = useState(false);
  const [hostChartData, setHostChartData] = useState({});
  const [topHostData, setHostData] = useState({topIPData: []});

  const [browserDataFetch, setBrowserDataFetch] = useState(false);
  const [browserChartData, setBrowserChartData] = useState({});
  const [topBrowserData, setBrowserData] = useState({topIPData: []});

  const [statusCodeDataFetch, setStatusCodeDataFetch] = useState(false);
  const [statusCodeChartData, setStatusCodeChartData] = useState({});
  const [topStatusCodeData, setStatusCodeData] = useState({topIPData: []});

  const [collectiveData, setCollectiveData] = useState(false);

                  const websiteList = [  "6c57ff46fa3109294beba88a5fbfcbff,3d.me",
                                         "8ed11fac55e4479c3469caf8d296a575,bestcanvas.ca",
                                         "80f86209d275479b117d11ca69805a0b,bestcanvas.dk",
                                         "465d6a553b19b48f7a97f83dfc905ce7,bestcanvas.se",
                                         "d389db2c7af454a69e9b61ea6cbadf00,bestecanvas.be",
                                         "bad38e9d3869811fb0a679792fec7503,bestecanvas.nl",
                                         "803c1c3e84319fda447233ebb7ee4cea,canvasdiscount.com",
                                         "b1243166956be33c8509d3f051cc801b,canvasonsale.com",
                                         "c21a96a38866fb4d21a45e6cc0baba6e,cdn-shop.com",
                                         "f605b4e315920a273346b4d244a23bdd,cdn.unitedartsgmbh.com",
                                         "04c6c5a2ce7b089600260c8deed87a20,foto-fox.de",
                                         "137edff1087c03b0e94812b5fbf83756,foto.rewe.de",
                                         "4c0984fe3a883be082d20ab159de4928,foto.rtl.de",
                                         "6aaba1678dcbbfa2db920d4adb7548c7,grafomap.com",
                                         "ac9db4606b8195886ac9c64ad85ebb54,limango-fotos.de",
                                         "ade916f3eac38583bf35d643557c379a,meinfoto.de",
                                         "082d5b75cba9b5e05ac1b8e97ce1473f,meinxxl.de",
                                         "a5df1217955d3b0db29fc180ad813913,merchone.com",
                                         "88a6f05ffc99fdf12862fe6921d02458,mi-arte.es",
                                         "f80a35add9097eb434389511cf654c5a,minunkuvani.fi",
                                         "b656b84a033dd86607e81f97929626f1,minuntaulut.fi",
                                         "85e11098ee953e20c374f88cc7851d0c,mixpix.me",
                                         "0e7a7732974b8590ba6cf221b54bd553,mojobraz.pl",
                                         "af541265758e220ad23721f18bb711a3,monoeuvre.fr",
                                         "bd2879bf9700c2599ec7802fa777ec4d,mypicture.ae",
                                         "d6aafcf695cd42b46e028ce914dd2d8b,mypicture.com.au",
                                         "d7632c127519671f6c9424381d98ca2c,my-picture.co.uk",
                                         "f0ef7a19333e8af02cb59b5747c06da0,photo.club",
                                         "6cff3d40d3d695f40a8207092c4af86a,photo.gifts",
                                         "f70698df95455b7edde1c1ac66362046,photo-sur-toile.be",
                                         "7f993b48f943d9fc0d228cc7c84efd69,photo-sur-toile.fr",
                                         "743b0fbc0003a7871f1111fb82a22e2b,picanova.com",
                                         "2067131736d128002c0a966e92f93fe6,picanova.co.uk",
                                         "c47518ce0d98117e028b97b2a8a4a59a,picanova.de",
                                         "ddc630f3a44111350e2216ddb9d47983,picanova.fr",
                                         "e0baf5830caca2bc8a04398606f915e4,stampa-su-tela.it",
                                         "8a798b795ca3ff470cf73ec91892cfeb,www.aldifotos.de",
                                         "adf3792e6ba194592bb07f4a4b65ca3a,www.lidl-fotos.at",
                                         "c74842b67917e60401fe0ffd52925a56,www.lidl-fotos.de" ];

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
      text: `Page Views for ${afterFetchSite}`
    }
  }
};

const ipOptions = {
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
      text: `Top IP address for ${afterFetchSite}`
    }
  }
};

const countryOptions = {
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
      text: `Top hits by country for ${afterFetchSite}`
    }
  }
};

const reffererOptions = {
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
      text: `Top refferers for ${afterFetchSite}`
    }
  }
};

const pathOptions = {
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
      text: `Top paths for ${afterFetchSite}`
    }
  }
};

const hostOptions = {
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
      text: `Top hosts for ${afterFetchSite}`
    }
  }
};

const browserOptions = {
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
      text: `Top browsers for ${afterFetchSite}`
    }
  }
};

const responseOptions = {
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
      text: `Top response for ${afterFetchSite}`
    }
  }
};

const handleChange = (event) => {
   var splitted = event.target.value.split(',')
   setValue(splitted[0]);
   setSite(splitted[1]);
};


const handleClick = async () => {

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
            setIsAlert(false);
            setAlertMessage('');
            setButtonClicked(true);
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

const TOP_BROWSERS = `
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
          metric: userAgentBrowser
          __typename
        }
        __typename
      }
    }
  }
}
`;

const TOP_STATUSCODES = `
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
          metric: edgeResponseStatus
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

    try {
      const response = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: PAGEVIEWS_QUERY })
      });

      const ipAddressQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOPIPADDRESS_QUERY })
      });

      const countryQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOPREQUESTSBYCOUNTRY_QUERY })
      });

      const reffererQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOP_REFFERERS })
      });

      const pathQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOP_PATHS })
      });

      const hostQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOP_HOSTS })
      });

      const browserQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOP_BROWSERS })
      });

      const statusQueryResponse = await fetch('http://localhost:8080/api.cloudflare.com:443/client/v4/graphql', {
        method: 'POST',
        headers: authorisationHeaders,
          body: JSON.stringify({ query: TOP_STATUSCODES })
      });

      if (!response.ok) {
        throw new Error(`Error! status: ${response.status}`);
      }

      const result = await response.json();
      const topIps = await ipAddressQueryResponse.json();
      const countryHits = await countryQueryResponse.json();
      const reffers = await reffererQueryResponse.json();
      const paths = await pathQueryResponse.json();
      const hosts = await hostQueryResponse.json();
      const browsers = await browserQueryResponse.json();
      const statusCodes = await statusQueryResponse.json();

      console.log(result)

      setData(result);
      setTopIPData(topIps);
      setTopCountryData(countryHits);
      setReffererData(reffers);
      setPathData(paths);
      setHostData(hosts);
      setBrowserData(browsers);
      setStatusCodeData(statusCodes);

      setAfterFetchSite(site);

      setIsLoading(false);

      const labels = await result.data.viewer.zones[0].httpRequests1hGroups.map(value => value.datetime.datetime)
      const ipLabels = await topIps.data.viewer.zones[0].top100IPs.map(value => value.device.device)
      const countryLabels = await countryHits.data.viewer.zones[0].top10Countries.map(value => value.countryName.clientCountryName)
      const reffererLabels = await reffers.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
      const pathLabels = await paths.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
      const hostLabels = await hosts.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
      const browserLabels = await paths.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)
      const statusCodeLabels = await paths.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.dimensions.metric)


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
      const ipData = {
        labels: ipLabels,
        datasets: [
          {
            label: "Top IPs",
            data: await topIps.data.viewer.zones[0].top100IPs.map(value => value.count),
            borderColor: "rgb(100, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };
      const countryData = {
        labels: countryLabels,
        datasets: [
          {
            label: "Top Countries",
            data: await countryHits.data.viewer.zones[0].top10Countries.map(value => value.sum.requests),
            borderColor: "rgb(150, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };
      const reffererData = {
        labels: reffererLabels,
        datasets: [
          {
            label: "Top Referrers",
            data: await reffers.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count),
            borderColor: "rgb(150, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };
      const pathData = {
        labels: pathLabels,
        datasets: [
          {
            label: "Top Paths",
            data: await paths.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count),
            borderColor: "rgb(150, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };
      const hostData = {
        labels: pathLabels,
        datasets: [
          {
            label: "Top Hosts",
            data: await hosts.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count),
            borderColor: "rgb(150, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };
      const browserData = {
        labels: pathLabels,
        datasets: [
          {
            label: "Top Browsers",
            data: await browsers.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count),
            borderColor: "rgb(150, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };
      const statusCodeData = {
        labels: statusCodeLabels,
        datasets: [
          {
            label: "Top Status Codes",
            data: await statusCodes.data.viewer.zones[0].httpRequestsAdaptiveGroups.map(value => value.count),
            borderColor: "rgb(150, 99, 132)",
            backgroundColor: "rgba(150, 99, 132, 0.5)"
          }
        ]
      };

      setChartData(mydata);
      setDataFetch(true);

      setIPChartData(ipData);
      setIPDataFetch(true);

      setCountryChartData(countryData);
      setCountryDataFetch(true);

      setReffererChartData(reffererData);
      setReffererDataFetch(true);

      setPathChartData(pathData);
      setPathDataFetch(true);

      setBrowserChartData(browserData);
      setBrowserDataFetch(true);

      setHostChartData(hostData);
      setHostDataFetch(true);

      setStatusCodeChartData(hostData);
      setStatusCodeDataFetch(true);
      setErr('')
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
        }
  };

const styleObject = {
      "float": "left",
      "margin": "auto",
      "height" : "40%",
      "width" : "100%"
}

const barObject = {
      "float": "left",
      "margin": "auto",
      "width": "50%"
}

const alertObject = {
      "color": "red"
}

  return (

    <div>
      {err && <h2>{err}</h2>}
      Site: <select value={value.split(',')[1]} onChange={handleChange}>
                     <option value="6c57ff46fa3109294beba88a5fbfcbff,3d.me">3d.me</option>
                     <option value="8ed11fac55e4479c3469caf8d296a575,bestcanvas.ca">bestcanvas.ca</option>
                     <option value="80f86209d275479b117d11ca69805a0b,bestcanvas.dk">bestcanvas.dk</option>
                     <option value="465d6a553b19b48f7a97f83dfc905ce7,bestcanvas.se">bestcanvas.se</option>
                     <option value="d389db2c7af454a69e9b61ea6cbadf00,bestecanvas.be">bestecanvas.be</option>
                     <option value="bad38e9d3869811fb0a679792fec7503,bestecanvas.nl">bestecanvas.nl</option>
                     <option value="803c1c3e84319fda447233ebb7ee4cea,canvasdiscount.com">canvasdiscount.com</option>
                     <option value="b1243166956be33c8509d3f051cc801b,canvasonsale.com">canvasonsale.com</option>
                     <option value="c21a96a38866fb4d21a45e6cc0baba6e,cdn-shop.com">cdn-shop.com</option>
                     <option value="f605b4e315920a273346b4d244a23bdd,cdn.unitedartsgmbh.com">cdn.unitedartsgmbh.com</option>
                     <option value="04c6c5a2ce7b089600260c8deed87a20,foto-fox.de">foto-fox.de</option>
                     <option value="137edff1087c03b0e94812b5fbf83756,foto.rewe.de">foto.rewe.de</option>
                     <option value="4c0984fe3a883be082d20ab159de4928,foto.rtl.de">foto.rtl.de</option>
                     <option value="6aaba1678dcbbfa2db920d4adb7548c7,grafomap.com">grafomap.com</option>
                     <option value="ac9db4606b8195886ac9c64ad85ebb54,limango-fotos.de">limango-fotos.de</option>
                     <option value="ade916f3eac38583bf35d643557c379a,meinfoto.de">meinfoto.de</option>
                     <option value="082d5b75cba9b5e05ac1b8e97ce1473f,meinxxl.de">meinxxl.de</option>
                     <option value="a5df1217955d3b0db29fc180ad813913,merchone.com">merchone.com</option>
                     <option value="88a6f05ffc99fdf12862fe6921d02458,mi-arte.es">mi-arte.es</option>
                     <option value="f80a35add9097eb434389511cf654c5a,minunkuvani.fi">minunkuvani.fi</option>
                     <option value="b656b84a033dd86607e81f97929626f1,minuntaulut.fi">minuntaulut.fi</option>
                     <option value="85e11098ee953e20c374f88cc7851d0c,mixpix.me">mixpix.me</option>
                     <option value="0e7a7732974b8590ba6cf221b54bd553,mojobraz.pl">mojobraz.pl</option>
                     <option value="af541265758e220ad23721f18bb711a3,monoeuvre.fr">monoeuvre.fr</option>
                     <option value="bd2879bf9700c2599ec7802fa777ec4d,mypicture.ae">mypicture.ae</option>
                     <option value="d6aafcf695cd42b46e028ce914dd2d8b,mypicture.com.au">mypicture.com.au</option>
                     <option value="d7632c127519671f6c9424381d98ca2c,my-picture.co.uk">my-picture.co.uk</option>
                     <option value="f0ef7a19333e8af02cb59b5747c06da0,photo.club">photo.club</option>
                     <option value="6cff3d40d3d695f40a8207092c4af86a,photo.gifts">photo.gifts</option>
                     <option value="f70698df95455b7edde1c1ac66362046,photo-sur-toile.be">photo-sur-toile.be</option>
                     <option value="7f993b48f943d9fc0d228cc7c84efd69,photo-sur-toile.fr">photo-sur-toile.fr</option>
                     <option value="743b0fbc0003a7871f1111fb82a22e2b,picanova.com">picanova.com</option>
                     <option value="2067131736d128002c0a966e92f93fe6,picanova.co.uk">picanova.co.uk</option>
                     <option value="c47518ce0d98117e028b97b2a8a4a59a,picanova.de">picanova.de</option>
                     <option value="ddc630f3a44111350e2216ddb9d47983,picanova.fr">picanova.fr</option>
                     <option value="e0baf5830caca2bc8a04398606f915e4,stampa-su-tela.it">stampa-su-tela.it</option>
                     <option value="8a798b795ca3ff470cf73ec91892cfeb,www.aldifotos.de">www.aldifotos.de</option>
                     <option value="adf3792e6ba194592bb07f4a4b65ca3a,www.lidl-fotos.at">www.lidl-fotos.at</option>
                     <option value="c74842b67917e60401fe0ffd52925a56,www.lidl-fotos.de">www.lidl-fotos.de</option>
      </select>
      <br></br>
      <p>Start Date:<DatePicker minDate={new Date(new Date().getTime() - (91 * 24 * 60 * 60 * 1000))} maxDate={new Date()} value={startDate} onChange={startDate => setStartDate(startDate)} /></p>
      <p>End Date:<DatePicker minDate={new Date(new Date().getTime() - (91 * 24 * 60 * 60 * 1000))} maxDate={new Date()} value={endDate} onChange={endDate => setEndDate(endDate)}  /></p>
      <p>{<button onClick={handleClick}>Fetch data</button>}</p>
      {isLoading && <h2>Loading...</h2>}
      {isAlert && <h3 style={alertObject}>{alertMessage}</h3>}
      <div style={styleObject}>
        <div style={barObject}>
          {dataFetch && <Bar options={options} data={chartData} />}
        </div>
        <div style={barObject}>
          {ipDataFetch && <Bar  options={ipOptions} data={ipChartData} />}
        </div>
        <div style={barObject}>
          {countryDataFetch && <Bar options={countryOptions} data={countryChartData} />}
        </div>
        <div style={barObject}>
          {reffererDataFetch && <Bar options={reffererOptions} data={reffererChartData} />}
        </div>
        <div style={barObject}>
          {pathDataFetch && <Bar options={pathOptions} data={pathChartData} />}
        </div>
        <div style={barObject}>
          {hostDataFetch && <Bar options={hostOptions} data={hostChartData} />}
        </div>
        <div style={barObject}>
          {browserDataFetch && <Bar options={browserOptions} data={browserChartData} />}
        </div>
        <div style={barObject}>
          {statusCodeDataFetch && <Bar options={responseOptions} data={statusCodeChartData} />}
        </div>
        <div >
          {<NewCollectiveData startDate={startDate} endDate={endDate} websiteList={websiteList}/>}
        </div>
      </div>
    </div>
  );
};

export default NewAppModifiedWithCalendar;
