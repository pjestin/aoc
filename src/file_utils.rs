use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

pub fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
  P: AsRef<Path>,
{
  let file = File::open(filename)?;
  Ok(io::BufReader::new(file).lines())
}

pub fn read_first_line<P>(filename: P) -> io::Result<std::string::String>
where
  P: AsRef<Path>,
{
  let first_line_option = read_lines(filename)?.next();
  match first_line_option {
    Some(first_line_result) => first_line_result,
    None => Err(io::Error::new(
      io::ErrorKind::UnexpectedEof,
      "No first line",
    )),
  }
}
