<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);

namespace Trendy;
require 'BaseModel.php';


class StatusMeta extends BaseModel{

	public $ID;
	public $StatusID;
	public $LastResponseCode;
	public $LastTestTime;
	public $CreationDate;
	public $Description;
	public $Visibility;

	public static function getByStatusID($StatusID)
	{
	    global $db;

	    $select    = self::getSelect() . " WHERE `StatusID` = :id";
	    $statement = $db->prepare($select);

	    $statement->bindParam(':id', $StatusID, PDO::PARAM_INT);
	    $statement->execute();

	    $result = $statement->fetchAll(PDO::FETCH_ASSOC);

	    return new static($result[0]);
	}

}


class Status extends BaseModel{


	public $ID = '';
	public $StatusName = '';
	public $StatusUrl = '';

	public function __constructor(){
	}

	public static function createStatus($jsonStatus){

		$NewStatus = json_decode($jsonStatus);

		$status = self::create((array)$NewStatus);
		$statusMeta = array(
			'ID' 				=> rand(),
			'StatusID' 			=> $NewStatus->ID,
			'LastResponseCode' 	=> 0,
			'LastTestTime'		=> date('Y-m-d H:i:s'),
			'CreationDate'		=> date('Y-m-d H:i:s'),
			'Description'		=>	'',
			'Visibility'		=> 3
			);

		$meta = StatusMeta::create((array)$statusMeta);

		$status->StatusMeta = $meta;

		return $status;

	}

	public function updateStatus($jsonStatus){
		$statusObj = json_decode($jsonStatus);
		$this->update((array)$statusObj);

		return $statusObj;
	}

	public function deleteStatus(){

		try 
		{	
			StatusMeta::getByStatusID($this->ID);
			$meta = StatusMeta::getByStatusID($this->ID);
			if ($meta !== null && ($meta->StatusID === $this->ID )) {
				$meta->delete();
				$this->delete();
			}
			echo '{message: "success"}';
		}
		catch (Exception $e) {
			echo '{error: "' . $e . '"}';
		}

	}


}


$status = array(
	'ID' 			=> rand(),
	'StatusName' 	=> '',
	'StatusUrl'		=> ''
);


$statusUpdate = array
(	'StatusName' 	=> 'frig off randy',
	'StatusUrl'		=> 'http://brazzers.com'
);

$status = Status::createStatus(json_encode($status));
$status->updateStatus(json_encode($statusUpdate));

var_dump($status);
echo '<pre>';
print_r(Status::getAll());

// Status::deleteStatus(26009);

// var_dump($model::create($status));

// var_dump(json_encode($model::getAll()));