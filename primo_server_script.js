
const http = require('http');

var num_richieste = 1;

var processa_richieste = function( richiesta , risposta )  {
   console.log(
     "\n\nSono emozionato ho ricevuto la mia RICHIESTA numero ",
     num_richieste++ 
   );
   console.log("il client mi chiede:\n" + richiesta.url );
   
   risposta.writeHead( 404 , "text/plain");
   
   var msg =  "Oh la pagina che cerchi non c'e'!";
   var il_mio_body = "<body>\n"+msg+"\n</body>"
   risposta.write( il_mio_body );
   risposta.end();
}

var callback_server_attivato = function(){
  console.log("SERVER PARTITO! Sono in ascolto!\n");
}

var server = http.createServer( processa_richieste );
server.listen( 80 , "127.0.0.1" , callback_server_attivato );
console.log("Eccomi pronto");