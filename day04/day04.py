def is_passphrase_valid(passphrase: str) -> bool:
    past_words: set[str] = set()
    for word in passphrase.split():
        if word in past_words:
            return False
        past_words.add(word)
    return True


def count_valid_passphrases(input: list[str]) -> int:
    return sum(1 if is_passphrase_valid(passphrase) else 0 for passphrase in input)


def is_passphrase_valid_with_anagrams(passphrase: str) -> bool:
    past_sorted_words: set[str] = set()
    for word in passphrase.split():
        sorted_word = "".join(sorted(word))
        if sorted_word in past_sorted_words:
            return False
        past_sorted_words.add(sorted_word)
    return True


def count_valid_passphrases_with_anagrams(input: list[str]) -> int:
    return sum(
        1 if is_passphrase_valid_with_anagrams(passphrase) else 0
        for passphrase in input
    )
