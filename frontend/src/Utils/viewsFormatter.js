function floorToTwoDecimals(number) {
    return Math.floor(number * 100) / 100;
  }

const viewsFormatter = (views) => {

    console.log("views: ", views);
    
    if(views < 1000){
        return views;
    }
    else if(views < 1000000){
        return views =  floorToTwoDecimals(views/1000) + "k";
    }
    else if(views < 1000000000){
        return views = floorToTwoDecimals(views/1000000) + "M";
    }
    else{
        return views = floorToTwoDecimals(views/1000000000) + "B";
    }
}

export default viewsFormatter;