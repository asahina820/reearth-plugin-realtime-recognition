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
    {
      obj_type: 'bicycle', //car,bus,track,bycecle,peopleのいずれかが入る
      timestamp: '2023-07-05T12:34:56Z', //ISO 8601型式
      location: {
        latitude: 35.8005, //検知した自動車の緯度
        longitude: 139.7877, //検知した自動車の経度
      },
    },
    {
      obj_type: 'bus', //car,bus,track,bycecle,peopleのいずれかが入る
      timestamp: '2023-07-05T12:34:56Z', //ISO 8601型式
      location: {
        latitude: 35.7755, //検知した自動車の緯度
        longitude: 139.7567, //検知した自動車の経度
      },
    },
    {
      obj_type: 'people', //car,bus,track,bycecle,peopleのいずれかが入る
      timestamp: '2023-07-05T12:34:56Z', //ISO 8601型式
      location: {
        latitude: 35.7855, //検知した自動車の緯度
        longitude: 139.7967, //検知した自動車の経度
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

    // objTypeごとにアイコン画像を設定
    // NOTE: アイコンを使用する際には出典を明記する必要あり
    // https://icons8.jp/license
    let iconUrl;
    switch (objType) {
      case 'car':
        iconUrl = 'https://img.icons8.com/ios-glyphs/30/car--v1.png';
        break;
      case 'bus':
        iconUrl = 'https://img.icons8.com/ios-glyphs/30/bus.png';
        break;
      case 'truck':
        iconUrl = 'https://img.icons8.com/ios-glyphs/30/truck.png';
        break;
      case 'bicycle':
        iconUrl = 'https://img.icons8.com/ios-glyphs/30/bicycle.png';
        break;
      case 'people':
        iconUrl = 'https://img.icons8.com/ios-glyphs/30/walking--v1.png';
        break;
      default:
        iconUrl = null;
        break;
    }

    addMarker(timestamp, objType, location, iconUrl);
  });
};

const addMarker = (timestamp, objType, location, iconUrl) => {
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
        image: iconUrl,
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
