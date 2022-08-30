export default (millis) => {
  let sec = Math.floor(millis / 1000);
  let hrs = Math.floor(sec / 3600);
  sec -= hrs * 3600;
  let min = Math.floor(sec / 60);
  sec -= min * 60;

  sec = '' + sec;
  sec = ('00' + sec).substring(sec.length);

  if (hrs > 0) {
    if(min < 10){
      min = '0' + min;
    }else{
      min = '' + min;
    }

    min = ('00' + min).substring(min.length);
    return hrs + ":" + min + ":" + sec;
  }
  else {
    if(min < 10){
      min = '0' + min;
    }else{
      min = '' + min;
    }
    return '00:'+min + ":" + sec;
  }
}