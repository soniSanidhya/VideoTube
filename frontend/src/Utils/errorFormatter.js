const errorFormatter = (error) => {
    const match = error.response.data.match(/<pre>(.*?)<\/pre>/i);
    const errorMessage = match ? match[1] : "an Error Occured";
    return errorMessage.slice(0 ,errorMessage.indexOf("<br>"))
}

export default errorFormatter;