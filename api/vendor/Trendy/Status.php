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
	    
	    //weird difference between php versions, check the php version being used on the trendy work computer,
	    //there's some issue here with inaccessible array elements. 
	    //http://stackoverflow.com/questions/11090328/undefined-offset-while-accessing-array-element-which-exists
	    foreach ($result as $result) {
	    	return new static($result);
	    }
	    // return new static($result[0]);
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

	public function updateStatus($status){
		$meta = StatusMeta::getByStatusID($this->ID);
		$update = json_decode($status['StatusMeta']);
		$this->update((array)$status);
		$meta->update((array)$update);
		// print_r(StatusMeta::getByStatusID($this->ID));
		// die();
		// $this->StatusMeta = $meta;
		// return $this;
	}

	public function deleteStatus(){
		try 
		{	
			$meta = StatusMeta::getByStatusID($this->ID);
			if ($meta !== null && ($meta->StatusID === $this->ID )) {
				$meta->delete();
				$this->delete();
			}
			return '{message: "success"}';
		}
		catch (Exception $e) {
			echo '{error: "' . $e . '"}';
		}

	}


}

