
<?php
 /** 
  * Name: Constant Definition file
  * All common constants used in themes are to be defined in this file
  * This applies for GCMW and all the subsites
  * This file has to be included in wp-contents file for loading
  * Care should be taken while defining that the constant created
  * is not already defined. Hence, to avoid problems start all constants
  * applicable to all sites with 'GCMWGEN_'
  */

  /* Define parameters for each site */

  //check and set content dir path
  if (!defined("WP_CONTENT_DIR"))
    define("WP_CONTENT_DIR", ABSPATH."/wp_content");

 //get the site parameters
  if (file_exists(WP_CONTENT_DIR.'/gcmw-library/xml/siteparameters.xml')) 
  {
    $siteparameters_obj = simplexml_load_file(WP_CONTENT_DIR.'/gcmw-library/xml/siteparameters.xml','SimpleXMLElement',LIBXML_NOCDATA);
    //var_dump($siteparameters_obj);
  } 
  else 
  {
    exit('Failed to open siteparameters.xml.');
    die();
  }

  /* use this function to get specific value of a node */
  function &getXMLnode($object, $param) {
        foreach($object as $key => $value) {
            if(isset($object->$key->$param)) {
                return $object->$key->$param;
            }
            if(is_object($object->$key)&&!empty($object->$key)) {
                $new_obj = $object->$key;
                $ret = getCfgParam($new_obj, $param);   
            }
        }
        if($ret) return (string) $ret;
        return false;
    }

    $siteparameters_arr= array();
    foreach ($siteparameters_obj->children() as $siteparams):
        $objtitle= strtoupper(strval($siteparams->title));
        $objid = intval(strval($siteparams->id));
        $objurl = strval($siteparams->url);
        $objtab = strtolower(strval($siteparams->tableprefix));
        $objcss =strval($siteparams->localcss);
        $objcsspath=strval($siteparams->localcsspath);
        $objstatus=intval($siteparams->sitestatus);        
        $siteparameters_arr[$objtitle]= array('id'=>$objid,'url'=>$objurl, 'tableprefix'=>$objtab, 'localcss'=>$objcss, 'localcsspath'=>$objcsspath, 'sitestatus'=>$objstatus) ;      
    endforeach;
  
  /*
    $siteparameters = array(
                      'GCMW' => array(                              
                                'id'=>1,                               
                                'url'=>'http://www.chinmayamission.com',
                                'tableprefix'=>'wp_'
                               ),
                      'VIBHOOTI'=>array(                              
                                'id'=>6,                               
                                'url'=>'http://vibhooti.chinmayamission.com',
                                'tableprefix'=>'wp_6_'
                               ),
                      'BCC'=>array(                              
                                'id'=>7,                               
                                'url'=>'http://bcc.chinmayamission.com',
                                'tableprefix'=>'wp_7_'
                               ),
                      'CMW'=>array(                              
                                'id'=>8,                               
                                'url'=>'http://cmw.chinmayamission.com',
                                'tableprefix'=>'wp_8_'
                               ),
                      'SINGAPORE'=>array(                              
                                'id'=>9,                               
                                'url'=>'http://singapore.chinmayamission.com',
                                'tableprefix'=>'wp_9_'
                               ),
                      'DELHI'=>array(                              
                                'id'=>10,                               
                                'url'=>'http://delhi.chinmayamission.com',
                                'tableprefix'=>'wp_10_'
                               ),
                      'BHAVNAGAR'=>array(                              
                                'id'=>12,                               
                                'url'=>'http://bhavnagar.chinmayamission.com',
                                'tableprefix'=>'wp_12_'
                               )
                      );
*/
//var_dump($siteparameters_arr);

 //loop and define each parameter
  foreach ($siteparameters_arr as $site=>$name):
    $sitename=$site.'SS';
    $urlname =$site.'URL';
    $tabname= $site.'TB';
    $cssname= $site.'CSS';
    $csspathname= $site.'CSSPATH';
    $statusname=$site.'STATUS';
    if (!defined ($sitename) ):
    define($sitename , $name['id']);
    endif;
    if (!defined ($urlname) ):
      define($urlname, $name['url']);
    endif;
    if (!defined ($tabname) ):
      define($tabname, $name['tableprefix']);
    endif;
    if (!defined ($tabname) ):
      define($cssname, $name['localcss']);
    endif;
    if (!defined ($tabname) ):
      define($csspathname, $name['localcsspath']);
    endif;
    if (!defined ($tabname) ):
      define($statusname, $name['sitestatus']);
    endif;
  endforeach;   

 /* Defining blog ids as constant */
  /*
  define('GCMWSS', 1);
  define('VIBHOOTISS', 6);
  define('BCCSS', 7);
  define('CMWCSS',8);
  define('SINGAPORESS', 9);
  define('DELHISS',10);
  define('BHAVNAGARSS', 12);*/

  /* Defining array of id & Site names */
  //$sitelist =
  //array('GCWMCSS','VIBHOOTISS','BCCSS','CMWCSS','SINGAPORESS','DELHISS','BHAVNAGARSS');



 
  /* Defining blog URLs */

/*  define ('GCMWURL', 'http://www.chinmayamission.com');
  define('VIBHOOTIURL', 'http://vibhooti.chinmayamission.com');
  define('BCCURL', 'http://bcc.chinmayamission.com');
  define('CMWURL', 'http://cmw.chinmayamission.com');      
  define ('SINGAPOREURL', 'http://singapore.chinmayamission.com');
  define ('DELHIURL','http://delhi.chinmayamission.com');
  define ('BHAVNAGARURL', 'http://bhavnagar.chinmayamission.com');
*/

  /* Defining the table names in MYSQL */
 /* define ('GCMWTB', 'wp_');
  define ('VIBHOOTITB','wp_6_');
  define('BCCTB','wp_7_');
  define('CMWTB', 'wp_8_');  
  define('SINGAPORETB', 'wp_9_');  
  define ('DELHITB','wp_10_');
  define ('BHAVNAGARTB','wp_12_');
  
*/
  ?>