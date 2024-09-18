// Clock
function updateClock() {
  const clockElement = document.getElementById('clock');
  const currentTime = new Date();
  clockElement.textContent = currentTime.toISOString().slice(0, 19).replace('T', ' ') + " UTC";
}
setInterval(updateClock, 1000);
updateClock();

// 24HR AGO TIME&DATE
let currentDate = new Date();
currentDate.setHours(currentDate.getHours() - 24);
let formattedDate = currentDate.toISOString().slice(0, 19) + 'Z';
// 1MNTH AGO TIME&DATE
currentDate.setMonth(currentDate.getMonth() - 1);
let formattedDate1MNTH = currentDate.toISOString().slice(0, 19) + 'Z';
//START TIME&DATE
let formattedDateAllTime = "2023-05-01T13:39:04Z";

// Format Date
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const apiKey = 'ro-uUn86iADszwex2vD2qHQ';
async function fetchData(endpoint) {
  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}
const endpoints = {
  endpoint1: 'https://updown.io/api/checks?api-key=' + apiKey,
  endpoint2: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey,
  endpoint3: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&from=' + formattedDate,
  endpoint4: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&group=time&from=' + formattedDate,
  endpoint5: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&group=host&from=' + formattedDate,
  endpoint6: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&from=' + formattedDate1MNTH,
  endpoint7: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&group=time&from=' + formattedDate1MNTH,
  endpoint8: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&group=host&from=' + formattedDate1MNTH,
  endpoint9: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&from=' + formattedDateAllTime,
  endpoint10: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&group=time&from=' + formattedDateAllTime,
  endpoint11: 'https://updown.io/api/checks/8bf6/metrics?api-key=' + apiKey + '&group=host&from=' + formattedDateAllTime,
  endpoint12: 'https://updown.io/api/checks/8bf6/downtimes?api-key=' + apiKey 
};

// Status circle
const statusCircle = document.getElementById('statusCircle');
const percent = document.getElementById('percent');
async function setStatusColor(data) {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('Invalid response format or empty data array for last status');
    return;
  }

  const down = data[0].down;
  if (down == true) {
    percent.style.color = 'red';
    statusCircle.style.backgroundColor = 'red';
    statusCircle.setAttribute('title', data[0].error);
  } else {
    const status = data[0].last_status;
    const statusMap = {
      200: { color: 'green', title: '200 OK' },
      404: { color: 'orange', title: 'Not Found?' },
      500: { color: 'red', title: 'Internal Server Error' },
      503: { color: 'red', title: 'Service unavailable' },
      504: { color: 'red', title: 'Gateway timeout' },
      524: { color: 'red', title: 'Timeout!' },
    };

    const { color = 'gray', title = 'Unknown' } = statusMap[status] || {};
    statusCircle.style.backgroundColor = color;
    statusCircle.setAttribute('title', title);
  }
}

// Percent
async function getPercent(data) {
  if (Array.isArray(data) && data.length > 0) {
    return data[0].uptime;
  } else {
    console.error('Invalid response format or empty data array for percent uptime');
    return null;
  }
}

// Last & Next Check
async function getNANDL(data) {
  if (Array.isArray(data) && data.length > 0) {
    const last_check_at = formatDate(data[0].last_check_at);
    const next_check_at = formatDate(data[0].next_check_at);
    return { last_check_at, next_check_at };
  } else {
    console.error('Invalid response format or empty data array for last and next check date');
    return null;
  }
}

// Up Since
async function getUpSince(data) {
  if (Array.isArray(data) && data.length > 0) {
    return formatDate(data[0].up_since);
  } else {
    console.error('Invalid response format or empty data array for up since');
    return null;
  }
}

// Requests Satisfied
async function getRQST(data2) {
  try {
    if (data2 && data2.requests && typeof data2.requests.satisfied !== 'undefined') {
      return data2.requests.satisfied;
    } else {
      console.error('Invalid response format or empty data for num of requests satisfied');
      return null;
    }
  } catch (error) {
    console.error('Error processing data:', error);
    return null;
  }
}

//Response AVR
async function getResponse(data) {
  try {
    const response = parseFloat(data.timings.total);
    return response;
  } catch (error) {
    console.error('Error parsing JSON or extracting Response value:', error);
    return null;
  }
}

// APDEX AVR
async function getApdex(data) {
  try {
    const firstTimestamp = Object.keys(data)[0];
    const apdex = parseFloat(data[firstTimestamp].apdex);
    return apdex;
  } catch (error) {
    console.error('Error parsing JSON or extracting APDEX value:', error);
    return null;
  }
}
async function getApdex2(data) {
  try {
    const getApdex2 = parseFloat(data.apdex);
    return getApdex2;
  } catch (error) {
    console.error('Error parsing JSON or extracting APDEX value:', error);
    return null;
  }
}

// Graph apdex values & graph
async function apdex24Values(data4) {  
  try {    
    const apdexValues = [];
    Object.keys(data4).forEach(timestamp => {
      const apdexValue = data4[timestamp].apdex;
      apdexValues.push(apdexValue);
    });
    return apdexValues;
  } catch (error) {
    console.error('Error fetching and extracting APDEX values:', error);
    return null;
  }
}
function generateApdexGraph(data) {
  const graphContainer = document.querySelector('.apdex24graphContainer');
  const maxValue = Math.max(...data);
  const interval = 2;
  let hourCounter = 0;

  data.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('apdex24bar');
    bar.style.height = `${(value / maxValue) * 100}%`;
    bar.style.left = `${index * 51 + 0}px`;

    if (value >= 0.8 && value < 0.9) {
      bar.style.backgroundColor = 'yellow';
    } else if (value < 0.8) {
      bar.style.backgroundColor = '#cc0003';
    }

    const valueDisplay = document.createElement('div');
    valueDisplay.classList.add('apdex24value');
    valueDisplay.textContent = value.toFixed(2);
    bar.appendChild(valueDisplay);

    if (index % (interval * 1) === 0) {
      const label = document.createElement('div');
      label.classList.add('apdex24label');
      label.textContent = `${hourCounter}hr`;
      label.style.left = `${index * 51}px`;
      graphContainer.appendChild(label);
      hourCounter += interval;
    }
    bar.addEventListener('mouseover', () => {
      valueDisplay.style.display = 'block';
    });
    bar.addEventListener('mouseleave', () => {
      valueDisplay.style.display = 'none';
    });

    graphContainer.appendChild(bar);
  });
}

// Response Graph
function generateResponseGraph(data3) {
  const response24graphContainer = document.querySelector('.response24graphContainer');
  const maxValue = Math.max(...data3);
  const labels = ['125ms', '250ms', '500ms', '1000ms', '2000ms', '4000ms', 'Fail'];

  data3.forEach((value, index) => {
    const barContainer = document.createElement('div');
    barContainer.classList.add('bar-container');

    const bar = document.createElement('div');
    bar.classList.add('response24bar');
    bar.style.height = `${(value / maxValue) * 100}%`;

    switch (labels[index]) {
      case '2000ms':
      case '4000ms':
        bar.style.backgroundColor = 'yellow';
        break;
      case 'Fail':
        bar.style.backgroundColor = '#cc0003';
        break;
    }

    const valueDisplay = document.createElement('div');
    valueDisplay.classList.add('response24value');
    valueDisplay.textContent = value;
    bar.appendChild(valueDisplay);

    const label = document.createElement('div');
    label.classList.add('response24label');
    label.textContent = labels[index];
    
    barContainer.appendChild(bar);
    barContainer.appendChild(label);

    bar.addEventListener('mouseover', () => {
      valueDisplay.style.display = 'block';
    });

    bar.addEventListener('mouseleave', () => {
      valueDisplay.style.display = 'none';
    });

    response24graphContainer.appendChild(barContainer);
  });
}

function isDayTimestamp(timestamp) {
  const hourMinuteSecond = timestamp.split(" ")[1];
  return hourMinuteSecond === "00:00:00";
}

// APDEX Graph
function generateApdex730Graph(data7) {
  const graphContainer = document.querySelector('.apdex730graphContainer');
  const maxValue = Math.max(...data7);
  const interval = 2;
  let hourCounter = 0;

  data7.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('apdex730bar');
    bar.style.height = `${(value / maxValue) * 100}%`;
    bar.style.left = `${index * 42 + 0}px`;

    if (value >= 0.8 && value < 0.9) {
      bar.style.backgroundColor = 'yellow';
    } else if (value < 0.8) {
      bar.style.backgroundColor = '#cc0003';
    }

    const valueDisplay = document.createElement('div');
    valueDisplay.classList.add('apdex730value');
    valueDisplay.textContent = value.toFixed(2);
    bar.appendChild(valueDisplay);

    if (index % (interval * 1) === 0) {
      const label = document.createElement('div');
      label.classList.add('apdex730label');
      label.textContent = `${hourCounter}d`;
      label.style.left = `${index * 42}px`;
      graphContainer.appendChild(label);
      hourCounter += interval;
    }
    bar.addEventListener('mouseover', () => {
      valueDisplay.style.display = 'block';
    });
    bar.addEventListener('mouseleave', () => {
      valueDisplay.style.display = 'none';
    });

    graphContainer.appendChild(bar);
  });
}

function generateResponseGraph730(data7) {
  const response730graphContainer = document.querySelector('.response730graphContainer');
  const maxValue = Math.max(...data7);
  const labels = ['125ms', '250ms', '500ms', '1000ms', '2000ms', '4000ms', 'Fail'];

  data7.forEach((value, index) => {
    const barContainer = document.createElement('div');
    barContainer.classList.add('bar-container');

    const bar = document.createElement('div');
    bar.classList.add('response730bar');
    bar.style.height = `${(value / maxValue) * 100}%`;

    // Apply color based on the label
    switch (labels[index]) {
      case '2000ms':
      case '4000ms':
        bar.style.backgroundColor = 'yellow';
        break;
      case 'Fail':
        bar.style.backgroundColor = '#cc0003';
        break;
    }

    const valueDisplay = document.createElement('div');
    valueDisplay.classList.add('response730value');
    valueDisplay.textContent = value;
    bar.appendChild(valueDisplay);

    const label = document.createElement('div');
    label.classList.add('response730label');
    label.textContent = labels[index];
    
    barContainer.appendChild(bar);
    barContainer.appendChild(label);

    bar.addEventListener('mouseover', () => {
      valueDisplay.style.display = 'block';
    });

    bar.addEventListener('mouseleave', () => {
      valueDisplay.style.display = 'none';
    });

    response730graphContainer.appendChild(barContainer);
  });
}


// APDEX All Time AVR
async function getAllTimeApdex(data9) {
  try {
    const getAllTimeApdex = parseFloat(data9.apdex);
    return getAllTimeApdex;
  } catch (error) {
    console.error('Error parsing JSON or extracting APDEX value:', error);
    return null;
  }
}

// APDEX All Time Graph
function generateApdexAllTimeGraph(data10) {
  const graphContainer = document.querySelector('.apdexAllTimeGraphContainer');
  const maxValue = Math.max(...data10);
  const interval = 2;
  let hourCounter = 0;

  data10.forEach((value, index) => {
    const bar = document.createElement('div');
    bar.classList.add('apdexAllBar');
    bar.style.height = `${(value / maxValue) * 100}%`;
    bar.style.left = `${index * 102 + 0}px`;

    if (value >= 0.8 && value < 0.9) {
      bar.style.backgroundColor = 'yellow';
    } else if (value < 0.8) {
      bar.style.backgroundColor = '#cc0003';
    }

    const valueDisplay = document.createElement('div');
    valueDisplay.classList.add('apdexAllValue');
    valueDisplay.textContent = value.toFixed(2);
    bar.appendChild(valueDisplay);

    if (index % (interval * 1) === 0) {
      const label = document.createElement('div');
      label.classList.add('apdexAllLabel');
      label.textContent = `${hourCounter}m`;
      label.style.left = `${index * 102}px`;
      graphContainer.appendChild(label);
      hourCounter += interval;
    }
    bar.addEventListener('mouseover', () => {
      valueDisplay.style.display = 'block';
    });
    bar.addEventListener('mouseleave', () => {
      valueDisplay.style.display = 'none';
    });

    graphContainer.appendChild(bar);
  });
}

// Response All Time
function generateResponseGraphAllTime(data9) {
  const responseAllTimeGraphContainer = document.querySelector('.responseAllTimeGraphContainer');
  const maxValue = Math.max(...data9);
  const labels = ['125ms', '250ms', '500ms', '1000ms', '2000ms', '4000ms', 'Fail'];

  data9.forEach((value, index) => {
    const barContainer = document.createElement('div');
    barContainer.classList.add('bar-container');

    const bar = document.createElement('div');
    bar.classList.add('responseAllTimeBar');
    bar.style.height = `${(value / maxValue) * 100}%`;

    switch (labels[index]) {
      case '2000ms':
      case '4000ms':
        bar.style.backgroundColor = 'yellow';
        break;
      case 'Fail':
        bar.style.backgroundColor = '#cc0003';
        break;
    }

    const valueDisplay = document.createElement('div');
    valueDisplay.classList.add('responseAllTimeValue');
    valueDisplay.textContent = value;
    bar.appendChild(valueDisplay);

    const label = document.createElement('div');
    label.classList.add('responseAllTimeLabel');
    label.textContent = labels[index];
    
    barContainer.appendChild(bar);
    barContainer.appendChild(label);

    bar.addEventListener('mouseover', () => {
      valueDisplay.style.display = 'block';
    });

    bar.addEventListener('mouseleave', () => {
      valueDisplay.style.display = 'none';
    });

    responseAllTimeGraphContainer.appendChild(barContainer);
  });
}

// NPM x = 1/33/65, y = 32/64/96
function generateNPM(data, x, y) {
  const bars = [];
  for (let i = x; i <= y; i++) {
    bars.push(document.getElementById(`bar${i}`));
  }

  delete data.mia;

  const arrangedData = {
    lan: data.lan,
    bhs: data.bhs,
    rbx: data.rbx,
    fra: data.fra,
    hel: data.hel,
    sin: data.sin,
    tok: data.tok,
    syd: data.syd
  };

  Object.keys(arrangedData).forEach(key => {
    const location = arrangedData[key];
    const { redirect, total, ...filteredTimings } = location.timings;
    arrangedData[key].timings = Object.values(filteredTimings).map(value => parseInt(value));
  });

  function combineTimingData(data) {
    const timingData = [];
    const keys = Object.keys(data);
    keys.forEach(key => {
      const locationTimings = data[key].timings;
      timingData.push(...locationTimings);
    });
    return timingData;
  }

  const allTimingData = combineTimingData(arrangedData);

  const maxTimingValue = Math.max(...allTimingData);

  function changeBarSizes(data) {
    const normalizedSizes = data.map(value => value / maxTimingValue);
    bars.forEach((bar, index) => {
      if (bar) {
        bar.textContent = data[index];
        bar.style.flexGrow = normalizedSizes[index];
      }
    });
  }

  changeBarSizes(allTimingData);
}

// Usage
fetchData(endpoints.endpoint1).then(data => {
  setStatusColor(data);
  console.log(data);
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
    if (window.innerWidth > 1660) {
      generateResponseGraph(responseData);
    };
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
      if (window.innerWidth > 1660) {
        generateApdexGraph(apdex24Values);
      };
    }
  });
});

fetchData(endpoints.endpoint5).then(data5 => {
  generateNPM(data5, 1, 32);
});

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
    if (window.innerWidth > 1660) {
      generateResponseGraph730(responseData);
    };
  };
});

fetchData(endpoints.endpoint7).then(data7 => {
  const dataArray = Object.values(data7);
  const slicedData7 = dataArray.slice(0, 29);

  apdex24Values(slicedData7).then(apdex730Values => {
    if (apdex730Values !== null) {
      if (window.innerWidth > 1660) {
        generateApdex730Graph(apdex730Values);
      };
    }
  });
});

fetchData(endpoints.endpoint8).then(data8 => {
  generateNPM(data8, 33, 64);
});

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
  if (data9 !== null) {
    const timingData = data9.requests.by_response_time;
    const responseData = [
      timingData.under125,
      timingData.under250 - timingData.under125,
      timingData.under500 - timingData.under250,
      timingData.under1000 - timingData.under500,
      timingData.under2000 - timingData.under1000,
      timingData.under4000 - timingData.under2000,
      data9.requests.failures  
    ];
    if (window.innerWidth > 1660) {
      generateResponseGraphAllTime(responseData);
    };
  };
});

fetchData(endpoints.endpoint10).then(data10 => {
  const dataArray = Object.values(data10);
  const slicedData10 = dataArray.slice(0, 12);
  apdex24Values(slicedData10).then(apdexAllTimeValues => {
    if (apdexAllTimeValues !== null) {
      if (window.innerWidth > 1660) {
        generateApdexAllTimeGraph(apdexAllTimeValues);
      };
    }
  });
})

fetchData(endpoints.endpoint11).then(data11 => {
  generateNPM(data11, 65, 96);
})

fetchData(endpoints.endpoint12).then(data12 => {
  const logDiv = document.getElementById('log');
  logDiv.innerHTML = '';
  logDiv.innerHTML += 'All time downtime (Latest-Oldest)<br><br>';
  data12.forEach(downtime => {
    const reason = downtime.error;
    const durationInMinutes = (downtime.duration / 60).toFixed(2);
    const startedAt = downtime.started_at;
    const endedAt = downtime.ended_at;
    logDiv.innerHTML += `> ${reason} - ${durationInMinutes} mins. Started at ${startedAt}, ended at ${endedAt}<br><br>`;
  });
});
