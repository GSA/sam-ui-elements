export class SelectedResultConfiguration {

    /**
     *  This is the primary field used to identify each object in the results
     */
    public primaryKeyField: string;
  
    /**
     *  Property from supplied model used for the top part of the basic template
     */
    public valueProperty: string;
  
    /**
     *  Property from supplied model used for the bottom part of the basic template
     */
    public subValueProperty: string;
  
    /**
    * Used to describe the drop down (Text should match the label that will be supplied)
    */
    public labelText: string;
  }
  