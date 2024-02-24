/*
# Bethesda Softworks LLC
// game.9095be396f3547555fe1039cbc894c88.net
Mighty = type=http-response,pattern=^https:\/\/game\.9095be396f3547555fe1039cbc894c88\.net\/game\/player\/user-data,requires-body=1,script-path=https://raw.githubusercontent.com/787a68/Surge/Script/Mighty.js
*/

let body = $response.body;
const obj = JSON.parse(body);

let slayers = [];
let uids = [1431453, 1448244, 1648560, 2604642, 2604643, 2604644, 7912818, 2604645, 2604646, 2604647, 2604648, 2604649, 2604650, 2604651, 2604652, 2604653, 2604654, 2604655];
let rids = [67, 69, 71, 72, 116, 117, 118, 157, 162, 169, 172, 227, 230, 240, 252, 261, 273, 286];
// get player's current level
let playerLevel = obj.user_data.player.level.current;
// push slayer objects with player's current level
uids.forEach((uid, i) => {
  slayers.push({
    uid,
    level: playerLevel,
    cosmetic: null,
    rid: rids[i]
  });
});
// assign slayers array to obj.user_data.inventory.slayers
obj.user_data.inventory.slayers = slayers;

/*
obj.user_data.inventory.slayers[3].level = obj.user_data.player.level.current;
*/

// loop through the inventory items
var items = ["weapons", "equipment", "launchers", "ultimates"];
for (var i = 0; i < items.length; i++) {
  var item = items[i];
  // check if the item exists
  if (obj.user_data.inventory[item]) {
    // loop through the item array
    for (var j = 0; j < obj.user_data.inventory[item].length; j++) {
      // modify the tier and level
      obj.user_data.inventory[item][j].tier = 5;
      obj.user_data.inventory[item][j].level = 90;
    }
  }
}

// stringify the modified object
body = JSON.stringify(obj);
$done({body});
