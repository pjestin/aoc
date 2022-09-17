package = "aoc2021"
version = "1.0-1"

source = {
  url = "git://github.com/pjestin/aoc2021.git",
}

description = {
  summary = " My solutions for Advent of Code 2021 in Lua (https://adventofcode.com/2021)",
  license = "MIT",
  homepage = "https://github.com/pjestin/aoc2021",
  maintainer = "pierre.jestin@gmail.com"
}

dependencies = {
  "luaunit"
}

build = {
  type = "none",
  install = {
    bin = {
      "rockspec"
    }
  }
}
