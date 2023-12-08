from __future__ import annotations
import functools 

class Card:
  def __init__(self, card_id: int, winning: set[int], own: set[int]) -> None:
    self.card_id: int = card_id
    self.winning: set[int] = winning
    self.own: set[int] = own
  
  def __str__(self) -> str:
    return f"{str(self.winning)} | {str(self.own)}"
  
  def __repr__(self) -> str:
    return str(self)
  
  @classmethod
  def parse(cls, line: str) -> Card:
    card_id: int = int(line.split(": ")[0].split()[1])
    numbers: str = line.split(": ")[1]
    winning_numbers: list[str] = numbers.split(" | ")[0].split()
    own_numbers: list[str] = numbers.split(" | ")[1].split()
    return Card(
      card_id, \
      set([int(number) for number in winning_numbers]), \
      set([int(number) for number in own_numbers]), \
    )

  def nb_winning(self) -> int:
    intersect: set[int] = self.winning.intersection(self.own)
    return len(intersect)
  
  def points(self) -> int:
    nb_winning: int = self.nb_winning()
    if not nb_winning:
      return 0
    else:
      return pow(2, nb_winning - 1)

def sum_points(lines: list[str]) -> int:
  cards: list[Card] = [Card.parse(line) for line in lines]
  return functools.reduce(lambda previous, card: previous + card.points(), cards, 0)

def count_cards(lines: list[str]) -> int:
  cards: list[Card] = [Card.parse(line) for line in lines]
  card_dict: dict[int, Card] = { card.card_id: card for card in cards }
  card_counts: list[int] = [1 for i in range(len(cards) + 1)]
  current_card_id: int = 1
  nb_cards: int = 0

  while current_card_id <= len(cards):
    current_card: Card = card_dict[current_card_id]
    nb_copies: int = card_counts[current_card_id]
    for next_card_id in range(current_card_id + 1, current_card_id + 1 + current_card.nb_winning()):
      card_counts[next_card_id] = card_counts[next_card_id] + nb_copies
    
    nb_cards += nb_copies
    current_card_id += 1
    
  return nb_cards
