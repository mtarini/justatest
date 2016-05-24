
const http = require('http');
const fs = require('fs');
const mongo = require('mongodb').MongoClient;

// variabili GLOBALI
var num_richieste = 1;
var db = null;

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

var fai_query_e_manda_risposta = function( risposta ) {
   var coll = db.collection("stores");
  
   var callback_processa_risultato = function( err, data ) {
       if (err==null) {
          console.log( data );
          console.log("ID del primo risultato: "+data[0]._id);
          console.log("Nome del primo risultato: ["+data[0].name+"]");
          
          risposta.writeHead(200, "text/html");
          risposta.write( "<body>\n" );
          risposta.write( "<h1>"+data[0].name+"</h1>\n" );
          risposta.write( "<h2>"+data[0].description+"</h2>\n" );
          risposta.write( "</body>\n" );
          risposta.end();
       }
   }
   
   var queryText = { _id: 3 }; 
   var queryResult = coll.find( queryText );
   
   queryResult.toArray( callback_processa_risultato ); 
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

// funzione per riscrivere la rischiesta.
// (Apache fa lo stesso servizio: e.g. cerca "httpd RewriteRule"
var rewrite = function( str ) {
   if (str == "/" ) return "/index.html";
   return str; // default
}

var callback_processa_richiesta = function( richiesta , risposta )  {
   console.log(
     "\n\nSono emozionato ho ricevuto la mia RICHIESTA numero ", num_richieste++ 
   );
   console.log("il client mi chiede la risorsa:\n" + richiesta.url );
   
   var nomeRichiesta = rewrite( richiesta.url );
   
   if ( endsWith( nomeRichiesta, ".html" ) ) {
     leggi_e_manda_file( "www" + nomeRichiesta, risposta );
   } else {
     fai_query_e_manda_risposta( risposta );
   }
   
}

var callback_server_attivato = function(){
  console.log("SERVER PARTITO! Sono in ascolto!\n");
}

var callback_connesso_con_mongodb = function( err_msg, database ){
  if (err_msg==null) {
     console.log("Sono connesso col server di MongoDB!\n");
     db = database;     
  } else {
     console.log("Connessione a MongoDB server: FALLITA!\n");
     console.log(err_msg);
  }
}

mongo.connect("mongodb://localhost/test" ,callback_connesso_con_mongodb );
// oppure: usando NAMELESS FUNCTION
// mongo.connect("mongodb://localhost" , function(){console.log("mongodb ok");} );

var server = http.createServer( callback_processa_richiesta );
server.listen( 80 , "127.0.0.1" , callback_server_attivato  );
console.log("Eccomi pronto");

