local StringUtils = {}

function StringUtils.split(s, sep)
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

function StringUtils.to_table(s)
    local t = {}

    for i = 1, #s do
        t[i] = s:sub(i, i)
    end

    return t
end

return StringUtils
