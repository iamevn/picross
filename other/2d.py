#!/usr/bin/env python3
import curses


class color:
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    DARKCYAN = '\033[36m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'


class chars:
    FILL = '█'
    CLEAR = '.'
    MARK = 'x'


class Puzzle2D:
    """A puzzle object storing the clues and current state of puzzle"""

    def __init__(self, width, height, horiz, vert):
        self.width = width
        self.height = height
        self.clues_horizontal = horiz
        self.clues_vertical = vert
        self.board = [[chars.CLEAR for j in range(width)]
                      for y in range(height)]
        self.cursor = [0, 0]

    def get_row(self, n):
        """return the row n's contents as a list"""
        return self.board[n]

    def get_col(self, n):
        """return the column n's contents as a list"""
        return [r[n] for r in self.board]

    def check(self, clues, slice):
        """return False if slice is filled incorrectly for clues,
        return True if filled correctly"""
        # eat leading whitespace on slice
        while len(slice) > 0 and slice[0] != chars.FILL:
            slice = slice[1:]
        if len(clues) == 0 and len(slice) == 0:
            # matched all clues to all filled in spaces
            return True
        elif len(slice) == 0:
            # there's leftover clues
            return clues[0] == 0
        elif len(clues) == 0:
            # there's leftover filled in spaces
            return False
        else:
            if len(slice) < clues[0]:
                return False
            for i in range(clues[0]):
                if slice[i] != chars.FILL:
                    return False
            if clues[0] == len(slice):
                return self.check(clues[1:], slice[clues[0]:])
            elif slice[clues[0]] == chars.FILL:
                return False
            else:
                return self.check(clues[1:], slice[clues[0]:])

    def check_row(self, n):
        return self.check(self.clues_horizontal[n], self.get_row(n))

    def check_col(self, n):
        return self.check(self.clues_vertical[n], self.get_col(n))

    def solved(self):
        """return True if puzzle is solved"""
        for i in range(self.height):
            if not self.check(self.clues_horizontal[i], self.get_row(i)) == 1:
                return False
        for i in range(self.width):
            if not self.check(self.clues_vertical[i], self.get_col(i)) == 1:
                return False
        return True

    def get(self, y, x):
        return self.board[y][x]

    def erase(self, y, x):
        self.board[y][x] = chars.CLEAR

    def set(self, y, x):
        self.board[y][x] = chars.FILL

    def mark(self, y, x):
        self.board[y][x] = chars.MARK

    def display_curses(self, stdscr):
        """print puzzle to terminal, curses"""
        # find longest printing vertical clue
        longest_v = 0
        for clue in self.clues_vertical:
            if len(clue) > longest_v:
                longest_v = len(clue)
        longest_h = 0
        for clue in self.clues_horizontal:
            if len(str.join(' ', (str(x) for x in clue))) + 1 > longest_h:
                longest_h = len(str.join(' ', (str(x) for x in clue))) + 1

        # print horizontal clues
        for i in range(self.height):
            s = ' ' + str.join(' ', (str(x) for x in self.clues_horizontal[i]))
            s = ' ' * (longest_h - len(s)) + s

            color = None
            if curses.has_colors():
                if self.check_row(i):
                    color = curses.color_pair(2)
                else:
                    color = curses.color_pair(1)

            stdscr.addstr(longest_v + i, 0, s, color)

        # print vertical clues
        for i in range(self.width):
            color = None
            if curses.has_colors():
                if self.check_col(i):
                    color = curses.color_pair(2)
                else:
                    color = curses.color_pair(1)

            for j in range(len(self.clues_vertical[i])):
                s = str(self.clues_vertical[i][j])
                if len(s) == 1:
                    s = ' ' + s
                stdscr.addstr(j + longest_v - len(self.clues_vertical[i]),
                              longest_h + i * 2,
                              s, color)

        def board2scr(y, x):
            return (longest_v + y, longest_h + x * 2 + 1)

        # print board
        for y in range(self.height):
            for x in range(self.width):
                stdscr.addstr(*board2scr(y, x), self.board[y][x][0])

        stdscr.move(*board2scr(*self.cursor))
        stdscr.refresh()

    def move_cursor(self, dir):
        if dir == 'left':
            self.cursor[1] = self.cursor[1] - 1
            if self.cursor[1] < 0:
                self.cursor[1] = 0
        elif dir == 'right':
            self.cursor[1] = self.cursor[1] + 1
            if self.cursor[1] >= self.width:
                self.cursor[1] = self.width - 1
        if dir == 'up':
            self.cursor[0] = self.cursor[0] - 1
            if self.cursor[0] < 0:
                self.cursor[0] = 0
        elif dir == 'down':
            self.cursor[0] = self.cursor[0] + 1
            if self.cursor[0] >= self.height:
                self.cursor[0] = self.height - 1

    def cycle_selected(self):
        """change selected spot from . to #, # to x, x to ."""
        current = self.get(*self.cursor)
        if current == chars.CLEAR:
            self.set(*self.cursor)
        elif current == chars.FILL:
            self.mark(*self.cursor)
        elif current == chars.MARK:
            self.erase(*self.cursor)

    def erase_selected(self):
        self.erase(*self.cursor)

    def mark_selected(self):
        self.mark(*self.cursor)

    def set_selected(self):
        self.set(*self.cursor)

    print('\0337', end='')

    def display_term(self):
        print('\0338', end='')
        """print puzzle to terminal, dumb and hacky way"""
        # find longest printing vertical clue
        longest_v = 0
        for clue in self.clues_vertical:
            if len(clue) > longest_v:
                longest_v = len(clue)
        longest_h = 0
        for clue in self.clues_horizontal:
            if len(clue) > longest_h:
                longest_h = len(clue)
        # print vertical clue
        for i in range(longest_v - 1, -1, -1):
            print('  ' * longest_h, end='')
            for col in self.clues_vertical:
                if len(col) <= i:
                    print('  ', end='')
                else:
                    print(f' {col[len(col) - i - 1]}', end='')
            print('')
        for y in range(self.height):
            row = self.clues_horizontal[y]
            if len(row) < longest_h:
                print('  ' * (longest_h - len(row)), end='')
            for clue in row:
                print(f' {clue}', end='')
            for spot in self.board[y]:
                print(f' {spot}', end='')
            print('')
# wtf'


def main(stdscr):
    curses.init_pair(1, curses.COLOR_RED, curses.COLOR_BLACK)
    curses.init_pair(2, curses.COLOR_GREEN, curses.COLOR_BLACK)
    puzzle = Puzzle2D(width=5, height=5,
                      vert=[[1], [2, 1], [1], [2, 1], [1]],
                      horiz=[[1, 1], [1, 1], [0], [1, 1], [3]])

    while True:
        puzzle.display_curses(stdscr)

        key = stdscr.getkey()
        if key == 'h':
            puzzle.move_cursor('left')
        elif key == 'j':
            puzzle.move_cursor('down')
        elif key == 'k':
            puzzle.move_cursor('up')
        elif key == 'l':
            puzzle.move_cursor('right')
        elif key == 'q':
            return
        elif key == ' ':
            puzzle.cycle_selected()
        elif key == '1':
            puzzle.set_selected()
        elif key == '2':
            puzzle.mark_selected()
        elif key == '3':
            puzzle.erase_selected()


curses.wrapper(main)
