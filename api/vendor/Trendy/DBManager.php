<?php

class DBManager {
   static $db ;
   private $dbh ;

   private function PDO_DBConnect(){
     $db_type = 'mysql'; 
     $db_name = 'TrendyStatus';
     $user = 'root' ;    $password = 'admin' ;
     $host = 'localhost' ; 
    try {
        $dsn = "$db_type:host=$host;dbname=$db_name"; 
        $this->dbh = new PDO( $dsn, $user, $password); 
        $this->dbh->setAttribute(PDO::ATTR_PERSISTENT, true);
        $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
     } catch ( PDOException $e ) {
        print "database Error! : " . $e->getMessage () . "\n" ;     
        die (); 
     }  
   }

   public static function getInstance ( ) {
     if (! isset ( DBManager::$db )) {
        DBManager::$db = new DBManager( );
		DBManager::$db->PDO_DBConnect();
     }
     return DBManager::$db->dbh;
  }

}

