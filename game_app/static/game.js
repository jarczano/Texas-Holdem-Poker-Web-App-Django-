var currentPathname = window.location.pathname;
var pathSegments = currentPathname.split('/');

// Get the last segment (last word)
var lastSegment = pathSegments[pathSegments.length - 1];

// Now lastSegment contains the last word of the pathname
console.log("Last segment: " + lastSegment);

var chatSocket = new WebSocket('ws://' + window.location.host + '/ws/some_path/');

const opponent_name = document.getElementById('opponent_name');

var opponentDict = {
    'bot': 'Bob',
    'ai': 'Carol',
    'gpt': 'Dave'
};

opponent_name.innerText = opponentDict[lastSegment];

const time_to_show_end_round_one_win = 3500;
const time_to_show_end_round_split = 7000;
const time_delay_hide_action_container = 1;

const common_card1 = document.getElementById('common_card1');
const common_card2 = document.getElementById('common_card2');
const common_card3 = document.getElementById('common_card3');
const common_card4 = document.getElementById('common_card4');
const common_card5 = document.getElementById('common_card5');

const player_card1 = document.getElementById('player_card1');
const player_card2 = document.getElementById('player_card2');

const player_stack = document.getElementById('player_stack');

const opponent_card1 = document.getElementById('opponent_card1');
const opponent_card2 = document.getElementById('opponent_card2');

const opponent_stack = document.getElementById('opponent_stack');

const player_bet = document.getElementById('player_bet');
const opponent_bet = document.getElementById('opponent_bet');
const pot = document.getElementById('pot');

const button_call = document.getElementById('button_call');
const button_check = document.getElementById('button_check');
const button_All_in = document.getElementById('button_All-in');
const button_Fold = document.getElementById('button_Fold');

const raise_container = document.getElementById('raise_container');
const button_Raise = document.getElementById('button_Raise');
const slider_raise = document.getElementById('slider_raise');

const action_container = document.getElementById('action_container');

const raiseValue = document.getElementById('raiseValue');

const name_opponent = sessionStorage.getItem('name_opponent');

slider_raise.addEventListener('input', () => {
   // console.log("sliver val",slider_raise.value);
    button_Raise.textContent = "Raise " + String(slider_raise.value) + " $";
    //console.log("sliver val",slider_raise.value);
});

var pause_one_win = false;
var pause_split_pot = false;

chatSocket.onmessage = function(event) {

  const data = JSON.parse(event.data);
  console.log('message', data)
  switch(data.type){

    case 'deal_player_cards':
      delay_function(()=>{
        deal_player_cards(data.message)});
      break;

    case 'deal_opponent_cards':
      delay_function(()=>{
        deal_opponent_cards()});
      break;

    case 'deal_flop_cards':
      delay_function(()=>{
        deal_flop_card(data.message);});
      break;

    case 'deal_turn_card':
      delay_function(()=>{
          deal_turn_card(data.message);});
      break;

    case 'deal_river_card':
      delay_function(()=>{
        deal_river_card(data.message);});
      break;

    case 'message_decision':
      delay_function(()=>{
        addMessage(data.message);});
      //addMessage(data.message);
      break;

    case 'finish_game':
      addMessage(data.message, 'end game');
      break;

    case 'player_option':
      delay_function(()=>{
        player_option(data.message)});
      break;

    case 'update_bet':
      delay_function(()=>{
        update_bet(data.message)});
      break;

    case 'update_stack':
       delay_function(()=>{
              update_stack(data.message)});
      break;

    case 'update_pot':
      delay_function(()=>{
        update_pot(data.message)});
      break;

    case 'finish_round_one_player':
      finish_round_one_player(data.message)
      break;

    case 'finish_round_split_pot':
      finish_round_split_pot(data.message)
      break;

    case 'show_down':
      show_down(data.message);
      break;

    case 'end':
      setTimeout(function(){
        window.location.href = "/menu";
      }, time_to_show_end_round_split)
      break
  }

}

function finish_round_one_player(data_message){
  pause_one_win = true
  var [winner_name, pot_win] = data_message;
  addMessage(winner_name + " win " + pot_win + "$");

  setTimeout(function(){
    clean_table();
    pause_one_win = false;
  }, time_to_show_end_round_one_win);
}

function finish_round_split_pot(data_message){
  pause_split_pot = true;
  var [name_player1, hand_player1, pot_win_player1, name_player2, hand_player2, pot_win_player2] = data_message;

  addMessage(name_player1 + ' with ' + hand_player1 + ' win ' + pot_win_player1 + "$");
  addMessage(name_player2 + ' with ' + hand_player2 + ' win ' + pot_win_player2 + "$");
  setTimeout(function(){
  clean_table();
  pause_split_pot = false;
  }, time_to_show_end_round_split);
}

function delay_function(callback){
    if (pause_one_win){
    setTimeout(function(){
      callback();
    }, time_to_show_end_round_one_win)}
  else if (pause_split_pot){
    setTimeout(function(){
      callback();
    }, time_to_show_end_round_split)}
  else{
  callback();}
}

function deal_player_cards(data_message){
  var [text_player_card1, text_player_card2] = data_message;
  console.log('var', text_player_card1, text_player_card2)
  player_card1.src = '../static/image/' + text_player_card1 + '.png';
  player_card2.src = '../static/image/'+ text_player_card2 + '.png';
  player_card1.style.display = 'flex';
  player_card2.style.display = 'flex';
}

function deal_opponent_cards(){
  opponent_card1.style.display = 'flex';
  opponent_card2.style.display = 'flex';
  opponent_card1.src = '../static/image/yellow_back.png';
  opponent_card2.src = '../static/image/yellow_back.png';
}

function deal_flop_card(data_message){
  var [text_flop_card1, text_flop_card2, text_flop_card3] = data_message;

  common_card1.src = '../static/image/' + text_flop_card1 + ".png";
  common_card2.src = '../static/image/' + text_flop_card2 + ".png";
  common_card3.src = '../static/image/' + text_flop_card3 + ".png";
  common_card1.style.opacity = 1;
  common_card2.style.opacity = 1;
  common_card3.style.opacity = 1;

  addMessage('Flop cards: ' + text_flop_card1 + ', ' + text_flop_card2 + ', ' + text_flop_card3)
}

function deal_turn_card(data_message){
  var [text_turn_card1] = data_message;
  common_card4.src = '../static/image/' + text_turn_card1 + ".png";
  common_card4.style.opacity = 1;

  addMessage('Turn card: ' + text_turn_card1);
}

function deal_river_card(data_message){
  var [text_river_card1] = data_message;
  common_card5.src = '../static/image/' + text_river_card1 + ".png";
  common_card5.style.opacity = 1;

  addMessage('River card: ' + text_river_card1)
}

function player_option(data_message){
 action_container.style.display = 'flex';

  var [option_check, option_call, option_raise_from, option_raise_to] = data_message;
  //[false/true     int/false  int/false    int/false]

  if (String(option_check) == "true"){
    button_check.style.display = "flex";}
  else{button_check.style.display = "none";}

  if (String(option_call) != "false"){
    button_call.style.display = "flex";
    button_call.textContent = "Call " + option_call + " $";}
  else{button_call.style.display = "none";}

  if (String(option_raise_from) != "false"){
    button_Raise.style.display = "flex";
    raise_container.style.display = "flex";
    button_Raise.textContent = "Raise " + option_raise_from + " $";
    slider_raise.min = option_raise_from;
    slider_raise.value = option_raise_from;
    slider_raise.max = option_raise_to;}
  else{
    raise_container.style.display = "none";}
}

function update_pot(data_message){
  var [new_pot] = data_message;
  pot.textContent = "Pot: " + new_pot + " $";
  pot.style.display = 'flex';
}

function update_bet(data_message){
      var [player_name, new_player_bet] = data_message;
      console.log('var', player_name, new_player_bet)
      if (player_name == "Alice"){
        if (new_player_bet != 0){
          player_bet.textContent = new_player_bet + " $";
          player_bet.style.display='flex'}
        else{player_bet.style.display='none';}}
      else{
        if (new_player_bet != 0){
          opponent_bet.textContent = new_player_bet + " $";
          opponent_bet.style.display='flex';}
        else{opponent_bet.style.display='none';}}
}

function update_stack(data_message){
  console.log('update_stack', data_message)
  var [player_name, new_player_stack] = data_message;
  if (player_name == "Alice"){
  player_stack.textContent = new_player_stack + " $";
  }
  else{
  opponent_stack.textContent = new_player_stack + " $";
  }
}

function show_down(data_message){
  var [text_opponent_card1 ,text_opponent_card2] = data_message;

  opponent_card1.src = '../static/image/' + text_opponent_card1 + ".png";
  opponent_card2.src = '../static/image/' + text_opponent_card2 + ".png";
}


// preload card images
const preloaderCard = document.getElementById("preloader_card");
const cardNames = ['2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', 'TC', 'JC', 'QC', 'KC', 'AC', '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', 'TS', 'JS', 'QS', 'KS', 'AS', '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', 'TH', 'JH', 'QH', 'KH', 'AH', '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', 'TD', 'JD', 'QD', 'KD', 'AD'];
function preloadCard(){
    for (let i=0; i<cardNames.length; i++){
        //const imagePath = '../static/image/${cardNames[i]}.png';
        const imagePath = '../static/image/' + cardNames[i] + '.png';
        preloaderCard.src = imagePath;
    }
}

preloadCard();


function clean_table(){
    // reset view table, card, bet, pot

    // preserve to displays previous cards
    player_card1.src = '../static/image/yellow_back.png';
    player_card2.src = '../static/image/yellow_back.png';
    common_card1.src = '../static/image/yellow_back.png';
    common_card2.src = '../static/image/yellow_back.png';
    common_card3.src = '../static/image/yellow_back.png';
    common_card4.src = '../static/image/yellow_back.png';
    common_card5.src = '../static/image/yellow_back.png';

    player_card1.style.display = 'none';
    player_card2.style.display = 'none';
    opponent_card1.style.display = 'none';
    opponent_card2.style.display = 'none';
    common_card1.style.opacity = 0;
    common_card2.style.opacity = 0;
    common_card3.style.opacity = 0;
    common_card4.style.opacity = 0;
    common_card5.style.opacity = 0;
    player_bet.style.display = 'none';
    opponent_bet.style.display = 'none';
    pot.style.display = 'none';
}

function hide_action_container(){
  setTimeout(function(){
    action_container.style.display = 'none'
  }, time_delay_hide_action_container);
}

// Send message to server -------------------------------------------------------------------------------------

const game_info = document.getElementById('game_info');

function start_game(){
    chatSocket.send(JSON.stringify({
        'type': 'start_game',
        'message': 'start_game'
    }));
}

function select_opponent(){
    chatSocket.send(JSON.stringify({
        'type': 'select_opponent',
        'message': lastSegment
    }));
}

// send call player decision to server
button_call.addEventListener('click', function(){
   chatSocket.send(JSON.stringify({
        'type': 'player_decision',
        'message': ['call', 0]
   }));
   hide_action_container()
});

// send check player decision to server
button_check.addEventListener('click', function(){
     chatSocket.send(JSON.stringify({
        'type': 'player_decision',
        'message': ['check', 0]
    }));
  hide_action_container();
});

// send fold player decision to server
button_Fold.addEventListener('click', function(){
       chatSocket.send(JSON.stringify({
        'type': 'player_decision',
        'message': ['fold', 0]
    }));
  hide_action_container();
});

// send all-in player decision to server
button_All_in.addEventListener('click', function(){
         chatSocket.send(JSON.stringify({
        'type': 'player_decision',
        'message': ['all-in', 0]
    }));
  hide_action_container()
});


// send raise player decision to server
button_Raise.addEventListener('click', function(){
           chatSocket.send(JSON.stringify({
        'type': 'player_decision',
        'message': ['raise', slider_raise.value]
    }));
  hide_action_container()
});


// Message container ---------------------------------------------------------
function addMessage(message, special=null) {
    const messageContainer = document.getElementById('messageContainer');
    const messageElement = document.createElement('div');

    messageElement.className = 'message';
    messageElement.textContent = message;

    if (message === "New round") {
        messageElement.classList.add('new-round');}

    if (special == 'end game'){
        messageElement.classList.add('end-round');}

    messageContainer.appendChild(messageElement);

    // Scroll to the bottom to show the latest message
    messageContainer.scrollTop = messageContainer.scrollHeight;
}


chatSocket.onopen = function(event) {
    console.log('WebSocket connection opened.');
    select_opponent();
    start_game();
};

