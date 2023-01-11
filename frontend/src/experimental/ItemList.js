import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import url from "..";
import { InlinkCard } from "./Cards";
import { InlinkForm } from "./Forms";

// EXPERIMENTAL: composite List component for in/outlinks
// This should be usable from any NodeWindow.
// 
// ItemList must GET "ext", then call "card" on each
// element of the response.
// 
// ItemList must also display the corrpesponding ItemForm:
// this might take some more work (i.e. this current form
// of composition may not be sufficient).
//
// USAGE: <ItemList card={InlinkCard}
//                  form={InlinkForm}
//                  ext={"inlinks"} />
function ItemList({ card, ext }) {
  const [cards, setCards] = useState([]);
  const params = useParams();

  const reload = useCallback(() => {
    axios.get(`${url}/${params.nodeId}/${ext}`).then((response) => {
      setCards(response.data.length > 0
        ? response.data.map((item) => (card(item)))
        : card(null));
    });
  }, []);

  useEffect(reload, [reload]);

  return (
    <div>
      {cards}
    </div>
  );
}

function InlinkList() {
  return (
    <div>
      {/* Question here: Both <InlinkForm /> and <ItemList /> need to access
          the *same* "reload()" callback. Because if we define one reload() in
          <ItemList /> and another in <InlinkForm />, then the reload() call in
          <InlinkForm /> will not be able to access the "setCards()" function
          in <ItemList />. */}
      <InlinkForm />
      <ItemList card={InlinkCard} ext={"inlinks"} />
    </div>
  );
}