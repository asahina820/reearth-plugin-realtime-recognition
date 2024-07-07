const html = `
  <style>
    html,body {
      margin: 0;
    }
    #btn-daily-traffic{
      margin:auto;
      width:100%;
      color:#fff;
      background: #00BEBE;
      border:1px solid #01ABAB;
      height:32px;
      box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
      border-radius: 2px;
    }
    #btn-daily-traffic:hover{
      cursor: pointer;
    }
    
  </style>
  <button id="btn-daily-traffic">直近24時間データ表示</button>
  <script>
    document.getElementById("btn-daily-traffic").addEventListener("click", function() {
      parent.postMessage("Button is clicked", "*");
    });
  </script>
`;

// button表示
reearth.ui.show(html);

// buttonが押された後の処理
reearth.on('message', () => {
  dailyData = getDailyData();
  addTrafficLayer(dailyData);
});

/**
 * 直近24時間の検知結果を取得します
 * @returns {JSON} 直近24時間の検知結果
 */
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
  // JSONデータ（API連携後に消す）
  const trafficData = [
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
  return trafficData;
};

/**
 * 交通の検知結果を地図上に表示します
 * @param {JSON} trafficData 交通の検知結果
 */
const addTrafficLayer = (trafficData) => {
  trafficData.forEach((item) => {
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

    addTrufficFeature(timestamp, objType, location, iconUrl);
  });
};

/**
 * 交通の検知結果を1件ずつ地図に表示します
 * @param {string} timestamp 時刻
 * @param {string} objType タイプ
 * @param {string} location 座標
 * @param {string} iconUrl アイコンのURL
 */
const addTrufficFeature = (timestamp, objType, location, iconUrl) => {
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
      },
    },
    infobox: {
      blocks: [
        {
          extensionId: 'textblock',
          pluginId: 'reearth',
          property: {
            default: {
              title: 'Date',
              text: timestamp,
            },
          },
        },
        {
          extensionId: 'textblock',
          pluginId: 'reearth',
          property: {
            default: {
              title: 'Location',
              text: location.latitude + ', ' + location.longitude,
            },
          },
        },
        {
          extensionId: 'textblock',
          pluginId: 'reearth',
          property: {
            default: {
              title: 'Type',
              text: objType,
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
