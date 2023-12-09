def gcd(a: int, b: int) -> int:
  if a < b:
    return gcd(b, a)

  while b > 0:
    r: int = a % b
    a = b
    b = r

  return a

def lcm(a: int, b: int) -> int:
  return a * b // gcd(a, b)
