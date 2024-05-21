// Initialize Variables
var overlay = document.getElementById("overlay");
function closePopup(id) {
  overlay.style.display = "none";
  document.getElementById(id).style.display = "none";
}
// Show Overlay and Popup
function popupDialog(id) {
  overlay.style.display = "block";
  document.getElementById(id).style.display = "block";
}

function show_messageNew(title) {
  alert("openModal");
}

const apiUrl =
  "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit/wiql/%7B3772faaa-ed72-44d9-90ac-2067d20937e5%7D?api-version=7.1-preview.2";

(async () => {
  const rawResponse = await fetch(apiUrl, {
    headers: {
      Authorization:
        "Basic am9zZXBoX2pvcmRlbkB1aGF1bC5jb206aGNpd2tydTJ3d2Uybnhycnh5aDZ3Y2p2bTdobHhsd2VqdXFhbHUyZmhsM2psZmpkNGV2YQ==",
      Accept: "application/json, text/plain, */*",
      "Content-type": "application/json; charset=UTF-8",
    },
  }).catch((error) => console.error("Error:", error));

  const content = await rawResponse.json();

  var html = "";

  for (var workItem of content.workItems) {
    var workitemUrl =
      "https://dev.azure.com/uhaul/U-Haul%20IT/_apis/wit/workitems/" +
      workItem.id +
      "?api-version=7.1-preview.3";

    const wiResponse = await fetch(workitemUrl, {
      headers: {
        Authorization:
          "Basic am9zZXBoX2pvcmRlbkB1aGF1bC5jb206aGNpd2tydTJ3d2Uybnhycnh5aDZ3Y2p2bTdobHhsd2VqdXFhbHUyZmhsM2psZmpkNGV2YQ==",
        Accept: "application/json, text/plain, */*",
        "Content-type": "application/json; charset=UTF-8",
      },
    }).catch((error) => console.error("Error:", error));

    const wiContent = await wiResponse.json();

    var color = "#4682B4";
    if (wiContent.fields["System.State"] == "Active") color = "#00A36C";

    //       html +=
    // "<div style='border-radius: 5px;box-shadow: 3px 3px #202020;padding:5px;background:#151B54;border:1px solid #1589FF'>" +
    // "<a target='new' style='color:" +
    // color +
    // "' href=" +
    // wiContent._links["html"]["href"] +
    // ">" +
    // wiContent.fields["System.Title"] +
    // "</a>&nbsp;" +
    // "<a href='#" +
    // workItem.id +
    // "'>...</a>" +
    // "</div>" +
    // "<div id='" +
    // workItem.id +
    // "' class='modal'>" +
    // "<div class='content'>" +
    // "<h1>" +
    // workItem.id +
    // "</h1>" +
    // wiContent.fields["Microsoft.VSTS.Common.ItemDescription"] +
    // "<a href='#' class='box-close'> × </a>" +
    // "</div>" +
    // "</div>" +
    // "<br />";

    html +=
      "<div style='border-radius: 5px;box-shadow: 3px 3px #202020;padding:5px;background:#151B54;border:1px solid #1589FF'>" +
      "<a target='new' style='color:" +
      color +
      "' href=" +
      wiContent._links["html"]["href"] +
      ">" +
      wiContent.fields["System.Title"] +
      "</a>&nbsp;" +
      "<button onClick='popupDialog(" +
      workItem.id +
      ")' id='btn" +
      workItem.id +
      "'>...</button>" +
      "</div>" +
      "<div class='popup' id='" +
      workItem.id +
      "'" +
      ">" +
      "<div class='popupcontrols'>" +
      "<button class='popupclose' onclick=closePopup(" +
      workItem.id +
      ")>X</button>" +
      "</div>" +
      "<div class='popupcontent'>" +
      "<h1>" +
      workItem.id +
      "</h1>" +
      wiContent.fields["Microsoft.VSTS.Common.ItemDescription"] +
      "</div>" +
      "</div>" +
      "<br />";
  }

  document.getElementById("content").innerHTML = html;

  console.log(content);
})();
