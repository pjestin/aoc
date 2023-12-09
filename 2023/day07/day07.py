from __future__ import annotations
from enum import IntEnum

class HandType(IntEnum):
  HIGH_CARD = 1
  ONE_PAIR = 2
  TWO_PAIR = 3
  THREE_OF_A_KIND = 4
  FULL_HOUSE = 5
  FOUR_OF_A_KIND = 6
  FIVE_OF_A_KIND = 7

class Hand:
  def __init__(self, cards: list[str], bid: int, joker: bool) -> None:
    self.cards = cards
    self.bid = bid
    self.joker = joker
  
  def __str__(self) -> str:
    return f"{"".join(self.cards)} {self.bid} {self.joker}"
  
  def __repr__(self) -> str:
    return str(self)

  @property
  def hand_type(self) -> HandType:
    counts: dict[str, int] = {}
    for card in self.cards:
      counts[card] = counts.get(card, 0) + 1
    nb_counts: int = len(counts)
    count_values: set[int] = set(counts.values())
    has_joker: bool = self.joker and "J" in counts

    if nb_counts == 1 or (has_joker and nb_counts == 2):
      return HandType.FIVE_OF_A_KIND
    elif 4 in count_values or (has_joker and nb_counts <= 3 and 1 in count_values and (counts["J"] > 1 or 3 in count_values)):
      return HandType.FOUR_OF_A_KIND
    elif nb_counts == 2 or (has_joker and nb_counts == 3):
      return HandType.FULL_HOUSE
    elif 3 in count_values or (has_joker and 2 in count_values):
      return HandType.THREE_OF_A_KIND
    elif nb_counts == 3 or (has_joker and counts["J"] == 2):
      return HandType.TWO_PAIR
    elif 2 in count_values or (has_joker and counts["J"] == 1):
      return HandType.ONE_PAIR
    else:
      return HandType.HIGH_CARD
  
  def _strength(self, card: str) -> int:
    match card:
      case "T":
        return 10
      case "J":
        return 1 if self.joker else 11
      case "Q":
        return 12
      case "K":
        return 13
      case "A":
        return 14
      case _:
        return int(card)

  def __lt__(self, other: Hand) -> bool:
    if self.hand_type != other.hand_type:
      return self.hand_type < other.hand_type

    for i in range(len(self.cards)):
      strength1: int = self._strength(self.cards[i])
      strength2: int = self._strength(other.cards[i])
      if strength1 != strength2:
        return strength1 < strength2
    
    return False

  @classmethod
  def parse(cls, line: str, joker: bool) -> Hand:
    split_line: list[str] = line.split()
    return Hand(list(split_line[0]), int(split_line[1]), joker)

def total_winnings(lines: list[str]) -> int:
  hands: list[Hand] = sorted(map(lambda line: Hand.parse(line, False), lines))
  return sum(map(lambda rank_hand: (rank_hand[0] + 1) * rank_hand[1].bid, enumerate(hands)))

def total_winnings_joker(lines: list[str]) -> int:
  hands: list[Hand] = sorted(map(lambda line: Hand.parse(line, True), lines))
  return sum(map(lambda rank_hand: (rank_hand[0] + 1) * rank_hand[1].bid, enumerate(hands)))
