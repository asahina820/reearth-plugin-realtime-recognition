const html = `
  <style>
    html,body {
      margin: 0;
    }
  </style>
  <button id="send">データ取得</button>
  <script>
    document.getElementById("send").addEventListener("click", function() {
      parent.postMessage("Button is clicked", "*");
    });
     window.addEventListener("message", function (e) {
      if (e.source !== parent) return;
      document.getElementById("msg").textContent = e.data;
    });
  </script>
`;

reearth.ui.show(html);
reearth.on('message', (msg) => {
  console.log('message received:', msg);
  dailyData = getDailyData();
  addMarkers(dailyData);
});

reearth.ui.postMessage('add marker');

const getDailyData = () => {
  // TODO: APIを叩く
  /*   const url = '/api/{UUID}/data/daily';
  // GETリクエストを送信してJSONデータを取得
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data); // 取得したJSONデータを表示
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    }); */
  // ファイル名 recognition.json
  const data = [
    {
      obj_type: 'car', //car,bus,track,bycecle,peopleのいずれかが入る
      timestamp: '2023-07-05T12:34:56Z', //ISO 8601型式
      location: {
        latitude: 35.6895, //検知した自動車の緯度
        longitude: 139.6917, //検知した自動車の経度
      },
    },
    {
      obj_type: 'truck', //car,bus,track,bycecle,peopleのいずれかが入る
      timestamp: '2023-07-05T12:34:56Z', //ISO 8601型式
      location: {
        latitude: 35.7895, //検知した自動車の緯度
        longitude: 139.7917, //検知した自動車の経度
      },
    },
  ];
  console.log(JSON.stringify(data));
  return data;
};

const addMarkers = (data) => {
  data.forEach((item) => {
    const timestamp = item.timestamp;
    const objType = item.obj_type;
    const location = item.location;
    addMarker(timestamp, objType, location);
  });
};

const addMarker = (timestamp, objType, location) => {
  reearth.layers.add({
    extensionId: 'marker',
    isVisible: true,
    title: `Tooltip`,
    property: {
      default: {
        location: {
          lat: location.latitude,
          lng: location.longitude,
        },
        style: 'image',
        image: 'https://static.reearth.io/assets/01genrxymmkfyncgh787whb1dy.png',
        label: false,
        labelBackground: true,
        labelPosition: 'top',
        labelTypography: {
          fontSize: 20,
        },
      },
    },
    infobox: {
      blocks: [
        {
          extensionId: 'textblock',
          pluginId: 'reearth',
          property: {
            default: {
              text: 'timestamp: ' + timestamp,
            },
          },
        },
        {
          extensionId: 'textblock',
          pluginId: 'reearth',
          property: {
            default: {
              text: 'location: ' + location.latitude + ', ' + location.longitude,
            },
          },
        },
        {
          extensionId: 'textblock',
          pluginId: 'reearth',
          property: {
            default: {
              text: 'Type: ' + objType,
            },
          },
        },
      ],
      property: {
        default: {
          title: 'Information',
        },
      },
    },
    tags: [],
  });
};
