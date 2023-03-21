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
        //const string filePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/FourWallsDoorWindowsRoof.ifc";
        const string filePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc";

        using (var model = IfcStore.Open(filePath))
        {
            var products = model.Instances.OfType<IIfcProduct>();
            var resultList = new  List <BuildingElement>();
           
            foreach (var product in products)
            {
                int id = product.EntityLabel;
                var description = product.Name;

                if (product is IIfcWall wall)
                {
                    //get single-value properties of the walls
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();

                    IIfcValue height = null;
                    IIfcValue length = null;
                    IIfcValue volume = null;
                    IIfcValue thermalTransmittance = null;

                    foreach (var property in properties)
                    {
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
                    
                    resultList.Add(new Wall{id = id, description = description, name = "Wall", height = height.ToString(), length = length.ToString(), volume = volume.ToString(), thermaltransmittance = thermalTransmittance.ToString()});
                }
                else if (product is IIfcDoor door)
                {
                    // get single-value properties of the doors
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();

                    IIfcValue maß = null;
                    IIfcValue volume = null;
                    IIfcValue area = null;
                    
                    foreach (var property in properties)
                    {
                        if (property.Name == "Reference")
                        {
                            maß = property.NominalValue;
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
                    
                    var height = door.OverallHeight;
                    var width = door.OverallWidth;
                    
                    resultList.Add(new Door{id = id,  description = description, name = "Door", measure = maß.ToString(), height = height.ToString(), width = width.ToString(), volume = volume.ToString()});
                    
                }
                else if (product is IIfcWindow window)
                {
                    // get single-value properties of the windows
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();

                    IIfcValue maß = null;
                    IIfcValue volume = null;
                    IIfcValue area = null;
                    IIfcValue thermal = null;
                    
                    foreach (var property in properties)
                    {
                        if (property.Name == "Reference")
                        {
                            maß = property.NominalValue;
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
                    
                    var height = window.OverallHeight;
                    var width = window.OverallWidth;
                    resultList.Add(new Window{id = id, description = description, name = "Window", measure = maß.ToString(), height = height.ToString(), width = width.ToString(), volume = volume.ToString(), thermaltransmittance = thermal.ToString()});
                    
                }
                else if (product is IIfcFurniture furniture)
                {
                    // get single-value properties of the windows
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();

                    IIfcValue volume = null;
                    IIfcValue level = null;

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
                    
                    resultList.Add(new Furniture{id = id, description = description, name = "Furniture", volume = volume.ToString(), level = level.ToString()});
                    
                }
                else if (product is IIfcRoof roof)
                {
                    // get single-value properties of the windows
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();

                    IIfcValue area = null;
                    IIfcValue thickness = null;
                    IIfcValue volume = null;
                    IIfcValue roughness = null;
                    IIfcValue thermalResistance = null;

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
                    
                    resultList.Add(new Roof{id = id, description = description, name = "Roof", area = area.ToString(), thickness = thickness.ToString(), volume = volume.ToString(), roughness = roughness.ToString(), thermalResistance = thermalResistance.ToString()});
                    
                }
                else if (product is IIfcPlate plate)
                {
                    // get single-value properties of the windows
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();

                    IIfcValue area = null;
                    IIfcValue volume = null;
                    IIfcValue type = null;

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
                    
                    resultList.Add(new Plate{id = id, description = description, name = "Plate", area = area.ToString(), volume = volume.ToString(), type = type.ToString()});
                    
                }
                else if (product is IIfcCovering covering)
                {
                    // get single-value properties of the windows
                    var properties = product.IsDefinedBy
                        .Where(r => r.RelatingPropertyDefinition is IIfcPropertySet)
                        .SelectMany(r => ((IIfcPropertySet)r.RelatingPropertyDefinition).HasProperties)
                        .OfType<IIfcPropertySingleValue>();
                    
                    IIfcValue volume = null;
                    IIfcValue roughness = null;
                    IIfcValue thermalResistance = null;
                    IIfcValue thickness = null;

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
                        Console.WriteLine($"Covering Property: {property.Name}, Value: {property.NominalValue}");
                    }
                    
                    resultList.Add(new Covering{id = id, description = description, name = "Covering", volume = volume.ToString(), roughness = roughness.ToString(), thermalResistance = thermalResistance.ToString(), thickness = thickness.ToString()});
                    
                }
                
                
            }
            

            // Swagger kann nur so eine richtige Ausgabe machen
            string json = JsonConvert.SerializeObject(resultList);
            return Content(json, "application/json");
            
            // Wenn das zurückgegeben wird, zeigt Swagger leere Objekte an, weil er die nicht darstellen kann.
            // Die resultList ist aber gefüllt mit allen Objekten
            return Ok(resultList);

        }

        
    }
    
    public static void test()
    {
        //GetWindowsDoorsAndWalls("/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc");
        //FindElementByLabel(205);

    }
    
    // Konvertiert die IFC-Datei in eine WexBIM-Datei
    public static void ConvertIfcToWexBim()
    {
        using var model = IfcStore.Open("/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc");
        var context = new Xbim3DModelContext(model);
        context.CreateContext (null, false);
        using var wexBimFile = System.IO.File.Create("SampleHouse.wexbim");
        using var wexBimBinarywriter = new BinaryWriter(wexBimFile);
        model.SaveAsWexBim(wexBimBinarywriter);
    }
    

    
    
    public static void PrintElementsWithEntityLabels()
    {
        //const string ifcFilePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/FourWallsDoorWindowsRoof.ifc";
        const string ifcFilePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc";
        using (var model = IfcStore.Open(ifcFilePath))
        {
            var elements = model.Instances.OfType<IIfcProduct>().ToList();

            Console.WriteLine($"Found {elements.Count} elements:");

            foreach (var element in elements)
            {
                Console.WriteLine($"EntityLabel: {element.EntityLabel}, Type: {element.GetType().Name}");
            }
        }
    }
}





