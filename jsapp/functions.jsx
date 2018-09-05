export function getCookieValue(key){
    let cookie = document.cookie.split(";")
    let cookieValues = {};
    console.log(cookie)
    for(let i = 0; i < cookie.length; i++){
        let valueStr = cookie[i].split("=")
        console.log(valueStr)
        cookieValues[valueStr[0].trim()] = valueStr[1];
    }
    console.log(cookieValues);
    return cookieValues[key];
}