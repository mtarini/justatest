
const http = require('http');
const fs = require('fs');

var num_richieste = 1;

var leggi_e_manda_file = function( nome_file , risposta ){
    
   var callback_file_letto = function( error_msg , data ){
      if (error_msg == null ) {
          console.log( "File non trovato: ");
          console.log( "   file: ",nome_file );
          risposta.writeHead( 200, "text/html" );
          risposta.write( data );
          risposta.end();
          console.log( "   mandato al client ");
      } else {
          console.log( "File non trovato: ");
          console.log( "   file: ",nome_file );
          console.log( "    err: ",error_msg );
          risposta.writeHead( 404 , "text/plain");
          risposta.write("Four-o-four!!!! No such file in this server");
          risposta.end();
      }
   }
   
   fs.readFile( nome_file , callback_file_letto );
}

var processa_richiesta = function( richiesta , risposta )  {
   console.log(
     "\n\nSono emozionato ho ricevuto la mia RICHIESTA numero ",
     num_richieste++ 
   );
   console.log("il client mi chiede:\n" + richiesta.url );
   
   leggi_e_manda_file( "www"+richiesta.url, risposta );
   
}

var callback_server_attivato = function(){
  console.log("SERVER PARTITO! Sono in ascolto!\n");
}

var server = http.createServer( processa_richiesta );
server.listen( 80 , "127.0.0.1" , callback_server_attivato );
console.log("Eccomi pronto");