<?php
class incrDate
	{
		/* *
		 * Name: incrDate
	     * Type: Class
	     * Purpose:  Useful for sanely incrementing a date.
	     * Returns:  Date incremented by one with adjustments to month and year if reqd.
	     * Called By: new instatiation   
		 * File name: incrDate.php
		 * @var $dateDay: String: returns the incremented day or 1
		 * @ver $dateMon: String: returns the incremented year or 1. 
		 		  				  format is int(as 1),short(as 'Jan') or long as ('January')
		 * @var $dateYear:String: returns the same year in YYYY format or incremented year.
		 * @var $dateInc: String: returns the date as a concat of above values.
		 */
			public  $dateDay;
			public  $dateMon;  // year 
			public  $dateYear; //year incremented if reqd
			public  $dateInc; //incremented date
			protected $dateDelim; //delimiter for d-m-y

		 	function __construct($date, $montype = 'M',$delim=' ')
			{
				if (is_string($date)):
					
				endif;
				//set the date delimiter
				$this->dateDelim = $delim;
				//set the date variables
				$this->setDateVars($date,$montype);
				//create the date
				$this->dateInc = $this->dateDay.$this->dateDelim.$this->dateMon.$this->dateDelim.$this->dateYear;				
			}

			public function setDateVars($indate,$montype)
			{
				//date_default_timezone_set('Asia/Kolkata');	    					    			
				$indate_ex =('70'== date('y',$indate))? date('d m', $indate):date('d m Y', $indate);
				echo $indate_ex;
				$indate_arr = explode(" ", $indate_ex);
				$inday = $indate_arr[0];
				$inmon = $indate_arr[1];
				
				if (sizeof($indate_arr)<3):
					array_push($indate_arr,'70');
				endif;
				$inyear=$indate_arr[2];
				$ldate = array(28,29,30,31);
				$eyears = array(1,3,5,7,8,10,12);

			 	//echo $inday.'-'.$inmon.'-'.$inyear.'<br/>';
				if (in_array($inday,$ldate) ) 
					{ 
						//sorted the dates for relevance 
						//now check for all dates seperately
						$exception = false;
						 switch ($inday)
						 {
	    					 case 28:
	    					 if ((!$eyears % 4) && intval($inmon)==2):
	    					 	$exception=true;
	    					 endif;
	    					 break;

	    					 case 29:
	    					 if (($eyears % 4) && intval($inmon)==2):
	    					 	$exception=true;
	    					 endif;
	    					 break;

	    					 case 30:				    					 
	    					 if (!in_array($inmon,$eyears)):
	    					 	$exception=true;
	    					 endif;
	    					 break;

	    					 case 31:
	    					 	$exception=true;
	    					 break;
	    					 
	    					 default:
	    					 $exception=false;
						}		    					
						$this->setExDate($exception,$inday,$inmon,$inyear,$montype);
					}
				else{
						//echo 'normal route <br/>';
						$this->setExDate(false,$inday,$inmon,$inyear,$montype);	    			
					}
			}

			public function setExDate($exception,$inday,$inmon,$inyear,$montype)
			{				
				if ($exception)
				{
					$inday=1;
					if($inmon<12) //if the month is not december
					{
				 		$inmon=$inmon+1;
				 	}
				 	else
				 	{
				 		$inmon=1;
				 		$inyear=$inyear+1;
				 		
				 	}
				 }
				 else
				 {
				 	$inday=$inday+1;
				 }

				 //search day in the array
				 $monthlist = array(
								1=>array('Jan','January','01'),
								2=>array('Feb','February', '02'),
								3=>array('Mar','Mar', '03'),
								4=>array('Apr','Apr', '04'),
								5=>array('May','May', '05'),
								6=>array('Jun','June', '06'),
								7=>array('Jul','July', '07'),
								8=>array('Aug','August', '08'),
								9=>array('Sep','September', '09'),
								10=>array('Oct','October', '10'),
								11=>array('Nov','November', '11'),
								12=>array('Dec','December', '12')
								);

				 foreach ($monthlist as $key => $value) {
				 	if ($inmon==$key)
				 		 {
				 		$inmon_arr=$value;
				 	}
				 }
				 	    					 
				 if (strcmp($montype,'M')==0):
				 	$inmon = $inmon_arr[0];
				 elseif (strcmp($montype,'m')==0):
				 	$inmon = $inmon_arr[2];
				 else:
				 	$inmon = $inmon_arr[1];
				 endif;

				 $this->dateDay = $inday;
				 $this->dateMon = $inmon;
				 $this->dateYear= $inyear;
			}
	
	}
?>