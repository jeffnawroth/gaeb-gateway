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
                int entityLabel = product.EntityLabel;
                var name = product.Name;

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

                        Console.WriteLine($" Wall Property: {property.Name}, Value: {property.NominalValue}");
                    }
                    
                    resultList.Add(new Wall{EntityLabel = entityLabel, Name = name, Höhe = height.ToString(), Länge = length.ToString(), Volumen = volume.ToString(), Wärmekoeffizient = thermalTransmittance.ToString()});
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

                        Console.WriteLine($" Door Property: {property.Name}, Value: {property.NominalValue}");
                    }
                    
                    var height = door.OverallHeight;
                    var width = door.OverallWidth;
                    
                    resultList.Add(new Door{EntityLabel = entityLabel,  Name = name, Maß = maß.ToString(), Höhe = height.ToString(), Weite = width.ToString(), Volumen = volume.ToString()});
                    
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
                        
                        Console.WriteLine($"Window Property: {property.Name}, Value: {property.NominalValue}");
                    }
                    
                    var height = window.OverallHeight;
                    var width = window.OverallWidth;
                    resultList.Add(new Window{EntityLabel = entityLabel, Name = name, Maß = maß.ToString(), Höhe = height.ToString(), Weite = width.ToString(), Volumen = volume.ToString(), Wärmekoeffizient = thermal.ToString()});
                    
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





