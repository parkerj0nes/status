<?php 

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

	public static function getAllStatus(){
		$statuses = self::getAll();
		$statusArray = array();

		foreach ($statuses as $status) {
			$fetched = new Self((array)$status);
			$fetchedStatusMeta = StatusMeta::getByStatusID($fetched->ID);
			$fetched->StatusMeta = $fetchedStatusMeta;
			$statusArray[] = $fetched;
		}

		return $statusArray;
	}

	public static function createStatus($jsonStatus){

		$NewStatus = json_decode($jsonStatus);
		$sMeta = json_decode($NewStatus->StatusMeta);
		$visibility = ($sMeta->Visibility == 'private') ? 0 : 1;

		$status = self::create((array)$NewStatus);
		$statusMeta = array(
			'ID' 				=> $sMeta->ID,
			'StatusID' 			=> $NewStatus->ID,
			'LastResponseCode' 	=> 0,
			'LastTestTime'		=> date('Y-m-d H:i:s'),
			'CreationDate'		=> date('Y-m-d H:i:s'),
			'Description'		=> $sMeta->Description,
			'Visibility'		=> $visibility
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

