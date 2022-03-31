import React from 'react';

import { List } from './components/List';

const App = () => {
  return (
    <List
      onSearch={(e) => console.log(e)}
      data={[
        {
          id: "3ac68afc-c605-48d3-a4f8-fbd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68ac-c6-48d3f8-fbd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c605-48d3-a4f81aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c605-48d3-a4f8d91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c648d3-a4f8-fbd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68c605-48d3-a4f8-fbd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c605-48d3-a4f8-fbd997",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c605-48d3-afbd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68c6048d3-a4bd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c605-484f8-fbd997",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc05-48d3-afbd91aa97",
          title: "Initial D",
          description: "Epic 90's JDM manga",
          image_url: "https://imgur.com/YnVIvcc.jpg",
        },
      ]}
    />
  );
};

/*const App = () => {
  return <Chapter onPublish={(e) => console.log(e)} />;
};*/

/*const App = () => {
  return (
    <Manga
      onSubscribe={() => console.log("subscribirse")}
      editable={true}
      manga={{
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97",
        title: "Initial D",
        description: "Epic 90's JDM manga",
        image_url: "https://imgur.com/YnVIvcc.jpg",
        chapters: [
          {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97",
            title: "001 - Hachiroku",
          },
          {
            id: "3ac68afc-c65-48d3-8-fbd91aa97",
            title: "002 - Akina",
          },
          {
            id: "3ac68ac-c6-48d3-f8-fbaa97",
            title: "003 - Project D",
          },
          {
            id: "3ac68afcc5-48d3-a-fbd91aa97",
            title: "004 - Keisuke",
          },
          {
            id: "3ac68ac-c6-8d3-f8-aa97",
            title: "003 - Project D",
          },
          {
            id: "3ac68afcc58d3-a-fbd91aa97",
            title: "004 - Keisuke",
          },
          {
            id: "3ac68ac-c6-48-f8-fbaa97",
            title: "003 - Project D",
          },
          {
            id: "3ac68af-48d3-a-fbd91aa97",
            title: "004 - Keisuke",
          },
        ],
      }}
    />
  );
};*/

/*   manga={{
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97",
        title: "Initial D",
        description: "Epic 90's JDM manga",
        image_url: "https://imgur.com/YnVIvcc.jpg",
        chapters: [
          {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97",
            title: "001 - Hachiroku",
          },
          {
            id: "3ac68afc-c65-48d3-8-fbd91aa97",
            title: "002 - Akina",
          },
          {
            id: "3ac68ac-c6-48d3-f8-fbaa97",
            title: "003 - Project D",
          },
          {
            id: "3ac68afcc5-48d3-a-fbd91aa97",
            title: "004 - Keisuke",
          },
          {
            id: "3ac68ac-c6-8d3-f8-aa97",
            title: "003 - Project D",
          },
          {
            id: "3ac68afcc58d3-a-fbd91aa97",
            title: "004 - Keisuke",
          },
          {
            id: "3ac68ac-c6-48-f8-fbaa97",
            title: "003 - Project D",
          },
          {
            id: "3ac68af-48d3-a-fbd91aa97",
            title: "004 - Keisuke",
          },
        ],
      }} */

/*const App = () => {
  return (
    <Reader
      onFinish={() => console.log("finish")}
      images={[
        {
          id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f6",
          url: "https://imgur.com/YnVIvcc.jpg",
        },
        {
          id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
          url: "https://i.imgur.com/sSG3Uqc.jpg",
        },
        {
          id: "58694a0f-3da1-471f-bd96-145571e29d72",
          url: "https://i.imgur.com/sesfg9O.jpg",
        },
        {
          id: "58694a0f-3da1-471f-bd96-145571e29d78",
          url: "https://i.imgur.com/I7ReGIY.jpg",
        },
        {
          id: "58694a0f-3da1-471f-bd96-145571ed78",
          url: "https://imgur.com/W0pPJEq.jpg",
        },
        {
          id: "58694a0f-3d-471f-bd96-1455729d78",
          url: "https://imgur.com/8BDlfxQ.jpg",
        },
        {
          id: "58694a0f-3d-471f-bd96-145571e29d78",
          url: "https://imgur.com/bhkfqb7.jpg",
        },
        {
          id: "58694a0fda1-471f-bd96-145571e29d78",
          url: "https://imgur.com/T1RSxRS.jpg",
        },
        {
          id: "58694a0f-3da1-1f-bd96-1455729d78",
          url: "https://imgur.com/NQST5Pl.jpg",
        },
        {
          id: "58694a0f-3da1-1f-bd96-145571e29d78",
          url: "https://imgur.com/c38P9tC.jpg",
        },
        {
          id: "58694a0f-31-471f-bd96-145571e29d78",
          url: "https://imgur.com/NWuUOmD.jpg",
        },
        {
          id: "58694a0f-3da1f-bd96-145571e29d78",
          url: "https://imgur.com/ge1kXru.jpg",
        },
        {
          id: "58694a0f-3da1-471f-b45571e29d78",
          url: "https://imgur.com/g15QkKi.jpg",
        },
        {
          id: "58694a0f-3da1-4d96-145571e29d78",
          url: "https://imgur.com/jJlNERv.jpg",
        },
      ]}
    />
  );
};*/

export default App;
