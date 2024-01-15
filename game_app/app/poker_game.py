from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from game_app.app.player_class import Player
from game_app.app.poker_round import poker_round
from game_app.app.split_pot import change_players_positions


def game(opponent, player_id):
    """
    This function works as generator. Plays a poker match.
    Sends information to the client about situation on the table.
    :param opponent: kind of opponent: bot, ai, gpt
    :param player_id: sid number
    :return: yield 'wait_for_player_decision' when is turn for client. yield 'end' at the end of the game
    """
    print("game for player id: ", player_id)
    channel_layer = get_channel_layer()

    opponent_dict = {'bot': 'Bob', 'ai': 'Carol', 'gpt': "Dave"}
    opponent_name = opponent_dict[opponent]

    player1 = Player('Alice', 1000, 0, 'human')
    player2 = Player(opponent_name, 1000, 1, opponent)

    Player.player_list = [player1, player2]
    Player.player_list_chair = [player1, player2]

    player_list_chair = Player.player_list_chair

    end = False
    while not end:

        # Play a round
        yield from poker_round(player_id)

        # Shift the button to the next player
        change_players_positions(shift=1)

        # Reset properties for each player
        [player.next_round() for player in player_list_chair]

        # Checks if anyone has lost
        for i in range(len(player_list_chair)):
            if player_list_chair[i].stack == 0:

                for player in player_list_chair:
                    async_to_sync(channel_layer.group_send)(
                        f'{player_id}', {
                            'type': 'update_stack',
                            'message': [player.name, player.stack]})

                winner_index = i ^ 1
                winner_name = player_list_chair[winner_index].name
                end = True

                async_to_sync(channel_layer.group_send)(
                    f'{player_id}', {
                        'type': 'finish_game',
                        'message': winner_name + ' win the game'})

                yield 'end'

