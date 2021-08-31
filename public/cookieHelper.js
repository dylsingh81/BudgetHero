//Cookie Helper File
function createCookie(cookieName, cookieValue){
    //Expiry default 1 year for this application
    cookieString = cookieName + "=" + cookieValue + ";"
    cookieString += "max-age=31536000;path=/"
    //console.log(cookieString)
    document.cookie = cookieString
}

function checkACookieExists(cookieName) {
    let startsWithString = cookieName +"="
    if (document.cookie.split(';').some((item) => item.trim().startsWith(startsWithString))) {
        return true
    }
    return false
  }


function getCookieValue(cookieName){
    let startsWithString = cookieName +"="
    
    let cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith(startsWithString))
    .split('=')[1];

    return cookieValue
}


