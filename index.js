/* Init dependencies */
const readline = require('readline');
const reader = readline.createInterface({
  input : process.stdin,
  output : process.stdout,
});


/* ---- Define app ---- */
const _app = {
  _board_state : null,

  _player_list : 'XO',
  _player_turn : 0,

  /* -- Main function that will execute repeatedly -- */
  game_loop : async () => {
    console.log('\n' + ('-').repeat(25));
    _app.show_board();
		
		let player_moved = false;
		let player_resigned = false;
		while (!player_moved && !player_resigned) {

			/* Gather Data */
			let user_in = await _app._internals.prompt(`\nPlayer ${_app._player_turn+1} enter a coord x,y to place your ${_app._player_list[_app._player_turn]} or enter 'q' to give up: `);
			let user_coord = String(user_in).match(/^(\d+),(\d+)$/);

			/* Evaluate new board state */
			if (String(user_in).toLowerCase() === 'q') {
				player_resigned = true;
				_app._internals.next_turn();
			}
			else if (user_coord == null) {
				console.error(`Invalid user coord "${user_in}"`);
			}
			else {
				let x = Number(user_coord[1]);
				let y = Number(user_coord[2]);
				let index = _app._internals.coord_to_index(x,y);
				if (index in _app._board_state) player_moved = _app._internals.make_move(index);
			}

		}

    

    /* Check global game state */
    let winner = _app._internals.game_winner();

    if (player_resigned) {
      console.log(`\n\nPlayer ${_app._player_turn+1} has won by default...\n`);
      await _app.reset();
    }
    else if (winner != null) {
      let winner_number = _app._player_list.indexOf(winner);
      console.log(`\n\nPlayer ${winner_number+1} has won the game!\n`);
      await _app.reset();
    }
    else if (_app._internals.game_draw()) {
      console.log('\n\nThe game has ended in a draw...\n');
      await _app.reset();
    }

    /* Repeat */
    return process.nextTick(_app.game_loop);
  },

  /* -- Prompt user, then start new game -- */
  reset : async () => {
    if (_app._player_list.indexOf('.') > -1) throw new Error('The player character "." is illegal');

    await _app._internals.prompt('Press Enter To Start A Game ');
		_app._board_state = ('.').repeat(3 * 3).split('');
		_app._player_turn = 0;
  },

  /* -- Log current board state in console -- */
  show_board : () => {
    console.log(
        '\nHere\'s the current board:'
      + '\n\n' + _app._board_state.slice(0,3).join(' ')
      + '\n\n' + _app._board_state.slice(3,6).join(' ')
      + '\n\n' + _app._board_state.slice(6,9).join(' ')
    );
  },

  _internals : {
    prompt : (text) => new Promise((resolve,reject) => {
      reader.question(text,resolve);
    }),

    coord_to_index : (x,y) => {
      if (x % 1) {
        console.error(`Invalid X coord "${x}"\nMust be a whole number`);
        return -1;
      }
      if (x < 1 || x > 3) {
        console.error(`Invalid X coord "${x}"\nMust be between 1 and 3`);
        return -1;
      }
  
      if (y % 1) {
        console.error(`Invalid Y coord "${y}"\nMust be a whole number`);
        return -1;
      }
      if (y < 1 || y > 3) {
        console.error(`Invalid Y coord "${y}"\nMust be between 1 and 3`);
        return -1;
      }
  
      return x - 1 + (y - 1) * 3
    },

    check_avail : (index) => _app._board_state[index] === '.',
  
    next_turn : () => _app._player_turn = (_app._player_turn + 1) % _app._player_list.length,

    make_move : (index) => {
      if (!_app._internals.check_avail(index)) {
        console.error(`\nOh no, a piece is already at this place! Try again...`);
        return false;
      }
  
      console.log('\nMove Accepted');
      _app._board_state[index] = _app._player_list[_app._player_turn];
      _app._internals.next_turn();
      return true;
    },

    game_winner : () => {
      /* Try 4 regex checks: 1 for each line that could cause a winning board. Each character of the line must be identical to the others and cannot be a "." */
      let state_string = _app._board_state.join('');
  
      let winner = state_string.match(/^(?:.{6}|.{3}|)([^\.])\1\1/) /* Will match horizontal line */
                || state_string.match(/([^\.]).{2}\1.{2}\1/) /* Will match vertical line */
                || state_string.match(/^([^\.]).{3}\1.{3}\1/) /* Will match \ slanting line */
                || state_string.match(/^.{2}([^\.]).\1.\1/) /* Will match / slanting line */
  
      if (winner) return winner[1];
    },

    game_draw : () => _app._board_state.indexOf('.') === -1,
  },
};


/* ---- App is defined. Start it up ---- */
Promise.resolve()
  .then(() => _app.reset())
  .then(() => _app.game_loop())
  .catch((err) => {
    console.error('Something has gone horribly wrong. The app will now exit');
    console.error(err);
    process.exit();
  });