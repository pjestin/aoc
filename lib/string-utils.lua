local StringUtils = {}

function StringUtils:split(s, sep)
    sep = sep or " "
    if string.len(sep) ~= 1 then
        error("Separator should be of length 1")
    end
    local words = {}
    for w in (s .. sep):gmatch("([^" .. sep .. "]*)" .. sep) do
        table.insert(words, w)
    end
    return words
end

return StringUtils
