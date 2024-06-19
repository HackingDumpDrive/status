<div style="text-align: center;">
  <img src="https://hackingdumpdrive.org/favicon.ico" alt="HackingDumpDrive Favicon">
</div>

## HackingDumpDrive Status Page<a id="top"></a>

Status page for [hackingdumpdrive.org](https://hackingdumpdrive.org). This project provides a UI to the [updown.io](https://updown.io) API. No monitoring is done by this site only API requests and layout. Live code at [status.hackingdumpdrive.org](https://status.hackingdumpdrive.org)


# Understanding the UI<a id="understanding-ui"></a>

The user interface is divided into four sections, each designed to provide specific data at a glance without requiring an in-depth analysis.

### 1. Overall Data

The first section provides a summary of essential information. Users can quickly view:

* Percent uptime
* Current status
* Last and next check
* Duration since last downtime
* Number of all-time satisfied requests

```
fetchData(endpoints.endpoint1).then(data => {
  setStatusColor(data);
  getPercent(data).then(percent => {
    if (percent !== null) {
      const percentDiv = document.getElementById('percent');
      percentDiv.textContent = percent + '%';
    }
  });
  getNANDL(data).then(nandl => {
    if (nandl !== null) {
      const lcaDiv = document.getElementById('lastcheck');
      lcaDiv.textContent += nandl.last_check_at += ' UTC';
      const ncaDiv = document.getElementById('nextcheck');
      ncaDiv.textContent += nandl.next_check_at += ' UTC';
    }
  });
  getUpSince(data).then(upSince => {
    if (upSince !== null) {
      const upSinceDiv = document.getElementById('upsince');
      upSinceDiv.textContent += upSince;
    }
  });
});

fetchData(endpoints.endpoint2).then(data2 => {
  if (data2 !== null) {
    getRQST(data2).then(satisfied => {
      if (satisfied !== null) {
        const rqstDiv = document.getElementById('requestsS');
        rqstDiv.textContent = satisfied + ' requests satisfied';
      }
    });
  }
});
```

`endpoints1-2`

This section offers a snapshot of performance, giving users the key information they need immediately.

### 2. 24-Hour Statistics

The second section presents statistics for the past 24 hours. It includes:

* Average APDEX<sup>[?](https://en.wikipedia.org/wiki/Apdex)</sup> value
* 24-hour APDEX graph
* Average response time
* 24-hour response time graph
* NPM<sup>[?](#npm)</sup> graph

```
fetchData(endpoints.endpoint3).then(data3 => {
  if (data3 !== null) {
    const timingData = data3.requests.by_response_time;
    const responseData = [
      timingData.under125,
      timingData.under250 - timingData.under125,
      timingData.under500 - timingData.under250,
      timingData.under1000 - timingData.under500,
      timingData.under2000 - timingData.under1000,
      timingData.under4000 - timingData.under2000,
      data3.requests.failures  
    ];
    generateResponseGraph(responseData);
    getResponse(data3).then(response24 => {
      if (response24 !== null) {
        const response24Div = document.getElementById('response24');
        response24Div.textContent = response24 + 'ms';
      }
    });
  }
});

fetchData(endpoints.endpoint4).then(data4 => {
  getApdex(data4).then(apdex => {
    if (apdex !== null) {
      const apdex24Div = document.getElementById('apdex24');
      apdex24Div.textContent = apdex;
    }
  });
  apdex24Values(data4).then(apdex24Values => {
    if (apdex24Values !== null) {
      generateApdexGraph(apdex24Values);
    }
  });
});

fetchData(endpoints.endpoint5).then(data5 => {
  generateNPM(data5, 1, 32);
});
```

`endpoints3-5`

These metrics help users identify any downtime or performance issues within the last day and determine if specific countries are affected.

### 3. Monthly Statistics

The third section provides the same types of data as the second section but over a monthly timeframe. This allows users to track trends and performance over a longer period.

```
fetchData(endpoints.endpoint6).then(data6 => {
  getApdex2(data6).then(apdex => {
    if (apdex !== null) {
      const apdex730Div = document.getElementById('apdexMnth');
      apdex730Div.textContent = apdex;
    }
  });
  getResponse(data6).then(response => {
    if (response !== null) {
      const response730Div = document.getElementById('responseMnth');
      response730Div.textContent = response + "ms";
    }
  });
  if (data6 !== null) {
    const timingData = data6.requests.by_response_time;
    const responseData = [
      timingData.under125,
      timingData.under250 - timingData.under125,
      timingData.under500 - timingData.under250,
      timingData.under1000 - timingData.under500,
      timingData.under2000 - timingData.under1000,
      timingData.under4000 - timingData.under2000,
      data6.requests.failures  
    ];
    generateResponseGraph730(responseData);
  };
});

fetchData(endpoints.endpoint7).then(data7 => {
  const dataArray = Object.values(data7);
  const slicedData7 = dataArray.slice(0, 29);

  apdex24Values(slicedData7).then(apdex730Values => {
    if (apdex730Values !== null) {
      generateApdex730Graph(apdex730Values);
    }
  });
});

fetchData(endpoints.endpoint8).then(data8 => {
  generateNPM(data8, 33, 64);
});
```

`endpoints6-8`

### 4. All-Time Statistics

The fourth section displays all-time statistics since 2023-05-01 13:39:04 UTC. It includes the same graphs and values as the previous sections, with an additional window called logs, this window shows all recorded downtimes, their cause and duration with the latest downtime is at the top

```
fetchData(endpoints.endpoint9).then(data9 => {
  getAllTimeApdex(data9).then(apdexAllTime => {
    if (apdexAllTime !== null) {
      const apdexAllTimeDiv = document.getElementById('apdexAll');
      apdexAllTimeDiv.textContent = apdexAllTime;
    }
  });
  getResponse(data9).then(responseAllTime => {
    if (responseAllTime !== null) {
      const responseAllTimeDiv = document.getElementById('responseAll');
      responseAllTimeDiv.textContent = responseAllTime + 'ms';
    }
  })
});

fetchData(endpoints.endpoint10).then(data10 => {
  const dataArray = Object.values(data10);
  const slicedData10 = dataArray.slice(0, 12);
  apdex24Values(slicedData10).then(apdexAllTimeValues => {
    if (apdexAllTimeValues !== null) {
      generateApdexAllTimeGraph(apdexAllTimeValues);
    }
  });
})

fetchData(endpoints.endpoint11).then(data11 => {
  generateNPM(data11, 65, 96);
})

fetchData(endpoints.endpoint12).then(data12 => {
  const logDiv = document.getElementById('log');
  logDiv.innerHTML = ''; // Clear existing content if needed
  data12.forEach(downtime => {
    const reason = downtime.error;
    const durationInMinutes = (downtime.duration / 60).toFixed(2);
    const startedAt = downtime.started_at;
    const endedAt = downtime.ended_at;
    logDiv.innerHTML += `> ${reason} - ${durationInMinutes} mins. Started at ${startedAt}, ended at ${endedAt}<br><br>`;
  });
});

```

`endpoints9-12`

To prevent data overload, the APDEX graph in this section is truncated to the last 12 months.

This comprehensive view helps users understand long-term performance and reliability trends.

# NPM (Network Performance Metrics)<a id="npm"></a>

NPM is the graph that is created by all 3 last sections. This graph indicates how much time each request took from different countries. Here is which color corresponds to which request:

* Green - Name lookup (`Client -> DNS`)
* Red - Connection (`Client -> Server`)
* Blue - Handshake (`Client <-> Server`)
* White - Response (`Client <- Server`)


# Contributing<a id="contributing"></a>

We welcome contributions from the community! If you have any improvements or bug fixes, please submit a pull request.


# License<a id="license"></a>

This project is licensed under the MIT License. You are free to use, modify, and distribute this project. However, any distribution must include a link to the original repository: [https://github.com/HackingDumpDrive/status](https://github.com/HackingDumpDrive/status).


# Authors<a id="authors"></a>

* [S1700](https://github.com/S1700)


# Acknowledgments<a id="acknowledgments"></a>

* [updown.io](https://updown.io) for providing the inspiration and the API for this project.

* All contributors and users who support and use this project.
