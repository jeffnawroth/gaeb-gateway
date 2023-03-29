using gaeb_gateway_backend.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Xbim.Ifc;
using Xbim.Ifc4.Interfaces;
using Xbim.ModelGeometry.Scene;


namespace gaeb_gateway_backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IfcController : ControllerBase
{   
    /// <summary>
    /// Gets a list of elements with their properties.
    /// </summary>
    /// <returns>A list of elements with properties.</returns>
    /// <response code="200">Returns the list of elements with properties.</response>
    /// <response code="500">If an exception occurs while retrieving the elements and properties.</response>
    [HttpGet]
    [ProducesResponseType(200, Type = typeof(List<BuildingElement>))]
    [ProducesResponseType(500)]
    public ActionResult<List<BuildingElement>> RetrieveIfcData()
{
    // Specify the path of the IFC file
    const string filePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc";

    // Open the IFC file
    using (var model = IfcStore.Open(filePath))
    {
        // Get all products in the IFC file
        var products = model.Instances.OfType<IIfcProduct>();

        // Create an empty list to hold the building elements
        var resultList = new List<BuildingElement>();

        // Loop through all products in the IFC file
        foreach (var product in products)
        {
            // Get the ID and description of the product
            int id = product.EntityLabel;
            var description = product.Name;

            // If the product is a wall
            if (product is IIfcWall wall)
            {
                // Get single-value properties of the wall
                var properties = product.IsDefinedBy
                    .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                    .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                    .OfType<IIfcPropertySingleValue>();

                // Initialize variables to hold the values of the properties
                IIfcValue height = null;
                IIfcValue length = null;
                IIfcValue volume = null;
                IIfcValue thermalTransmittance = null;

                // Loop through all properties of the wall
                foreach (var property in properties)
                {
                    // Get the value of the property
                    if (property.Name == "Unconnected Height")
                    {
                        height = property.NominalValue;
                    }
                    if (property.Name == "Length")
                    {
                        length = property.NominalValue;
                    }
                    if (property.Name == "Volume")
                    {
                        volume = property.NominalValue;
                    }
                    if (property.Name == "ThermalTransmittance")
                    {
                        thermalTransmittance = property.NominalValue;
                    }
                }

                // Add the wall data to the result list
                resultList.Add(new Wall{
                    id = id,
                    description = description,
                    name = "Wall",
                    unit = "m³",
                    height = height.ToString(),
                    length = length.ToString(),
                    volume = volume.ToString(),
                    thermaltransmittance = thermalTransmittance.ToString()
                });
            }
            // If the product is a door
            else if (product is IIfcDoor door)
            {
                // Get single-value properties of the door
                var properties = product.IsDefinedBy
                    .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                    .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                    .OfType<IIfcPropertySingleValue>();

                // Initialize variables to hold the values of the properties
                IIfcValue measure = null;
                IIfcValue volume = null;
                IIfcValue area = null;

                // Loop through all properties of the door
                foreach (var property in properties)
                {
                    // Get the value of the property
                    if (property.Name == "Reference")
                    {
                        measure = property.NominalValue;
                    }
                    if (property.Name == "Volume")
                    {
                        volume = property.NominalValue;
                    }
                    if (property.Name == "Area")
                    {
                        area = property.NominalValue;
                    }
                }

                    // Get the height and width of the door
                    var height = door.OverallHeight;
                    var width = door.OverallWidth;
                    
                    // Add the door data to the result list
                    resultList.Add(new Door{id = id,  description = description, name = "Door", unit = "mm", measure = measure.ToString(), height = height.ToString(), width = width.ToString(), volume = volume.ToString()});
                    
            }
            // If the product is a window
            else if (product is IIfcWindow window)
{
            // Get single-value properties of the windows
            var properties = product.IsDefinedBy
                .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                .OfType<IIfcPropertySingleValue>();

            // Initialize variables for storing property values
            IIfcValue measure = null;
            IIfcValue volume = null;
            IIfcValue area = null;
            IIfcValue thermal = null;
                        
            // Loop through all properties of the wall
            foreach (var property in properties)
            {
                if (property.Name == "Reference")
                {
                    measure = property.NominalValue;
                }
                if (property.Name == "Volume")
                {
                    volume = property.NominalValue;
                }
                if (property.Name == "Area")
                {
                    area = property.NominalValue;
                }
                if (property.Name == "ThermalTransmittance")
                {
                    thermal = property.NominalValue;
                }
            }
                        
            // Get the height and the width of the door
            var height = window.OverallHeight;
            var width = window.OverallWidth;
                        
            // Add the window data to the result list
            resultList.Add(new Window{
                id = id,
                description = description,
                name = "Window",
                unit = "mm",
                measure = measure.ToString(),
                height = height.ToString(),
                width = width.ToString(),
                volume = volume.ToString(),
                thermaltransmittance = thermal.ToString()
            });                
}           
            // If product is a furniture
            else if (product is IIfcFurniture furniture)
            {
                // Get single-value properties of the furniture
                var properties = product.IsDefinedBy
                    .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                    .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                    .OfType<IIfcPropertySingleValue>();

                // Initialize variables for storing property values
                IIfcValue volume = null;
                IIfcValue level = null;

                // Loop through all properties of the wall
                foreach (var property in properties)
                {
                    if (property.Name == "Volume")
                    {
                        volume = property.NominalValue;
                    }
                    if (property.Name == "Level")
                    {
                        level = property.NominalValue;
                    }
                }
                        
                // Add the furniture data to the result list
                resultList.Add(new Furniture{
                    id = id,
                    description = description,
                    name = "Furniture",
                    unit = "mm",
                    volume = volume.ToString(),
                    level = level.ToString()
                });
                        
            }
            // If product is a roof
            else if (product is IIfcRoof roof)
            {
                // Get single-value properties of the roof
                var properties = product.IsDefinedBy
                    .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                    .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                    .OfType<IIfcPropertySingleValue>();

                // Initialize variables for storing property values
                IIfcValue area = null;
                IIfcValue thickness = null;
                IIfcValue volume = null;
                IIfcValue roughness = null;
                IIfcValue thermalResistance = null;
                
                // Loop through all properties of the wall
                foreach (var property in properties)
                {
                    if (property.Name == "Area")
                    {
                        area = property.NominalValue;
                    }
                    if (property.Name == "Thickness")
                    {
                        thickness = property.NominalValue;
                    }
                    if (property.Name == "Volume")
                    {
                        volume = property.NominalValue;
                    }
                    if (property.Name == "Roughness")
                    {
                        roughness = property.NominalValue;
                    }
                    if (property.Name == "Thermal Resistance (R)")
                    {
                        thermalResistance = property.NominalValue;
                    }
                        
                }
                // Add Roof data to the result list
                resultList.Add(new Roof{id = id, description = description, name = "Roof", unit = "m³", area = area.ToString(), thickness = thickness.ToString(), volume = volume.ToString(), roughness = roughness.ToString(), thermalResistance = thermalResistance.ToString()});
                    
            }
            // If product is a plate
            else if (product is IIfcPlate plate)
            {
                // Get single-value properties of the windows
                var properties = product.IsDefinedBy
                    .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                    .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                    .OfType<IIfcPropertySingleValue>();

                IIfcValue area = null;
                IIfcValue volume = null;
                IIfcValue type = null;
                
                // Loop through all properties of the wall
                foreach (var property in properties)
                {
                    if (property.Name == "Area")
                    {
                        area = property.NominalValue;
                    }
                    if (property.Name == "Volume")
                    {
                        volume = property.NominalValue;
                    }
                    if (property.Name == "Reference")
                    {
                        type = property.NominalValue;
                    }
                        
                }
                // Add Plate data to the result list
                resultList.Add(new Plate{id = id, description = description, name = "Plate", unit = "m³", area = area.ToString(), volume = volume.ToString(), type = type.ToString()});
                    
            }
            // If Product is a covering
            else if (product is IIfcCovering covering)
            {
                // Get single-value properties of the windows
                var properties = product.IsDefinedBy
                    .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                    .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                    .OfType<IIfcPropertySingleValue>();
                    
                IIfcValue volume = null;
                IIfcValue roughness = null;
                IIfcValue thermalResistance = null;
                IIfcValue thickness = null;
                
                // Loop through all properties of the wall
                foreach (var property in properties)
                {
                    if (property.Name == "Volume")
                    {
                        volume = property.NominalValue;
                    }
                    if (property.Name == "Roughness")
                    {
                        roughness = property.NominalValue;
                    }
                    if (property.Name == "Thermal Resistance (R)")
                    {
                        thermalResistance = property.NominalValue;
                    }
                    if (property.Name == "Thickness")
                    {
                        thickness = property.NominalValue;
                    }
                }
                // Loop through all properties of the wall    
                resultList.Add(new Covering{id = id, description = description, name = "Covering", unit = "m³", volume = volume.ToString(), roughness = roughness.ToString(), thermalResistance = thermalResistance.ToString(), thickness = thickness.ToString()});
                    
            }
                
                
        }
            

        string json = JsonConvert.SerializeObject(resultList);
        return Content(json, "application/json");
        
    }

        
}
    
    // Converts IFC into wexBim
    public static void ConvertIfcToWexBim()
    {
        using var model = IfcStore.Open("/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc");
        var context = new Xbim3DModelContext(model);
        context.CreateContext (null, false);
        using var wexBimFile = System.IO.File.Create("SampleHouse.wexbim");
        using var wexBimBinarywriter = new BinaryWriter(wexBimFile);
        model.SaveAsWexBim(wexBimBinarywriter);
    }
}





