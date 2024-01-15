import json
from asgiref.sync import async_to_sync
import hashlib
from game_app.app.game_class import Game
from channels.generic.websocket import WebsocketConsumer


class MyConsumer(WebsocketConsumer):
    games = {}

    def connect(self):
        headers = dict(self.scope["headers"])
        player_id = hashlib.md5(headers.get(b'sec-websocket-key', b'')).hexdigest()
        if player_id not in self.games:
            async_to_sync(self.channel_layer.group_add)(player_id, self.channel_name)
            self.accept()
            self.games[player_id] = Game(player_id)

    def disconnect(self, close_code):
        headers = dict(self.scope["headers"])
        player_id = hashlib.md5(headers.get(b'sec-websocket-key', b'')).hexdigest()
        self.games.pop(player_id, None)
        async_to_sync(self.channel_layer.group_discard)(player_id,  self.channel_name)

    def receive(self, text_data=None, bytes_data=None):
        headers = dict(self.scope["headers"])
        player_id = hashlib.md5(headers.get(b'sec-websocket-key', b'')).hexdigest()

        text_data_json = json.loads(text_data)
        if text_data_json['type'] == 'start_game':
            game = self.games.get(player_id)
            game.start_game()
        elif text_data_json['type'] == 'select_opponent':
            game = self.games[player_id]
            game.select_opponent(text_data_json['message'])
        elif text_data_json['type'] == 'player_decision':
            game = self.games.get(player_id)
            game.send_player_decision(text_data_json['message'])

            if game.state == 'end':
                self.send(text_data=json.dumps({'type': 'end'}))
        # print("Received from client: ", self,' massage: ',text_data_json['message'])

    def deal_player_cards(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'deal_player_cards',
            'message': message
        }))

    def deal_opponent_cards(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'deal_opponent_cards',
            'message': message
        }))

    def message_decision(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'message_decision',
            'message': message
        }))

    def player_option(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'player_option',
            'message': message}))

    def update_bet(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'update_bet',
            'message': message}))

    def update_stack(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'update_stack',
            'message': message}))

    def update_pot(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'update_pot',
            'message': message}))

    def finish_game(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'finish_game',
            'message': message}))

    def hide_opponent_decision(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'hide_opponent_decision',
            'message': message}))

    def deal_flop_cards(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'deal_flop_cards',
            'message': message}))

    def deal_turn_card(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'deal_turn_card',
            'message': message}))

    def deal_river_card(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'deal_river_card',
            'message': message}))

    def show_down(self, event):
        print("SHOW DOWN CONSUMER")
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'show_down',
            'message': message}))

    def finish_round_split_pot(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'finish_round_split_pot',
            'message': message}))

    def finish_round_one_player(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type': 'finish_round_one_player',
            'message': message}))



