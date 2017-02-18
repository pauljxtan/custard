<?php

class Response
{
  private $response;

  public function __construct()
  {
    $this->response = array();
    // TODO: errors, etc.
  }

  public function getResponse()
  {
    return $this->response;
  }

  public function addStuff($key, $value)
  {
    $this->response[$key] = $value;
  }

  public function getStuff($key)
  {
    try {
      $stuff = $this->response[$key];
    }
    catch (Exception $e) {
      echo $e->getMessage();
      $stuff = null;
    }
    return $stuff;
  }

  public function __toString()
  {
    return var_export($this->response, true);
  }

}

?>