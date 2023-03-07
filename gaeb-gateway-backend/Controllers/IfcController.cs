using System.IO;
using Microsoft.AspNetCore.Mvc;
using Xbim.Ifc;
using Xbim.Ifc4.Interfaces;
using Xbim.ModelGeometry.Scene;


namespace gaeb_gateway_backend.Controllers;


[Route("api/[controller]")]
[ApiController]
public class IfcController : ControllerBase
{
    public class IfcEntity
    {
        public int EntityLabel { get; set; }
        public string Name { get; set; }
        public string GlobalId { get; set; }
        public string ProductType { get; set; }
        public IIfcProduct Product { get; set; }
    }
    
    // Erste Variante
    public static IfcEntity[] ReadIfcEntities()
    {
        const string filePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/FourWallsDoorWindowsRoof.ifc";
        // Erstelle einen neuen IfcStore, der die IFC-Datei lädt
        using var model = IfcStore.Open(filePath);

        // Greife auf die Ifc-Produkteigenschaften des Modells zu
        var products = model.Instances.OfType<IIfcProduct>();

        // Erstelle ein leeres Array von IfcEntity-Objekten
        var entityList = new List<IfcEntity>();

        // Iteriere über alle Produkte im Modell und füge sie zur entityList hinzu
        foreach (var product in products)
        {
            var entity = new IfcEntity
            {
                EntityLabel = product.EntityLabel,
                Name = product.Name ?? string.Empty,
                GlobalId = product.GlobalId,
                ProductType = product.GetType().Name,
                Product = product
            };
            entityList.Add(entity);
        }
        // Konvertiere entityList in ein Array von IfcEntity-Objekten
        var entities = entityList.ToArray();

        // Gib jedes Objekt im Array auf der Konsole aus
        // Das ist nur zum Testen der Ausgabe
        foreach (var entity in entities)
        {
            Console.WriteLine($"EntityLabel: {entity.EntityLabel}");
            Console.WriteLine($"Name: {entity.Name}");
            Console.WriteLine($"GlobalId: {entity.GlobalId}");
            Console.WriteLine($"ProductType: {entity.ProductType}");
            Console.WriteLine();
        }

        // Gib das Array von IfcEntity-Objekten zurück
        return entities;
    }
    
    // Zweite Variante
    public static (int EntityLabel, IIfcProduct Product)[] ReadIfcEntitiess(string filePath)
    {
        // Erstelle einen neuen IfcStore, der die IFC-Datei lädt
        using var model = IfcStore.Open(filePath);

        // Greife auf die Ifc-Produkteigenschaften des Modells zu
        var products = model.Instances.OfType<IIfcProduct>();

        // Erstelle ein leeres Array von (int, IfcProduct)-Tupeln
        var productList = new List<(int, IIfcProduct)>();

        // Iteriere über alle Produkte im Modell und füge sie zur productList hinzu
        foreach (var product in products)
        {
            var entityLabel = product.EntityLabel;
            productList.Add((entityLabel, product));
        }

        // Gib Informationen zu jedem Objekt in der Konsole aus
        // Das ist nur zum Testen der Ausgabe
        foreach (var (entityLabel, product) in productList)
        {
            Console.WriteLine($"EntityLabel: {entityLabel}");
            Console.WriteLine($"Produkt-Typ: {product.GetType().Name}");
            Console.WriteLine($"GlobalId: {product.GlobalId}");
            Console.WriteLine($"Name: {product.Name}");
        }

        return productList.ToArray();
    }
    public static void test()
    {
        //GetWindowsDoorsAndWalls("/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc");
        //FindElementByLabel(205);
        ReadIfcEntities();
    }

    
    
    // Ab hier erstmal nicht beachten !!!
    
    

    
    
    // Konvertiert die IFC-Datei in eine WexBIM-Datei
    public static void ConvertIfcToWexBim()
    {
        using var model = IfcStore.Open("/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/SampleHouse.ifc");
        var context = new Xbim3DModelContext(model);
        context.CreateContext (null, false);
        using var wexBimFile = System.IO.File.Create("SampleHouse.wexbim");
        using var wexBimBinarywriter = new BinaryWriter(wexBimFile);
        model.SaveAsWexBim(wexBimBinarywriter);
        /*
        using (var model = IfcStore.Open(ifcFilePath))
        {
            var context = new Xbim3DModelContext(model);
            context.CreateContext();

            var wexBimMemoryStream = new MemoryStream();
            using (var wexBimBinaryWriter = new BinaryWriter(wexBimMemoryStream))
            {
                model.SaveAsWexBim(wexBimBinaryWriter);
            }

            return wexBimMemoryStream;
        }
        */
        /*
        using (XbimModel model = ParseModelFile(ifcFileName, xbimFileName, true))
        {
            var m3D = new Xbim3DModelContext(model);
            try
            {
                m3D.CreateContext(geomStorageType: XbimGeometryType.PolyhedronBinary);
                var bw = new BinaryWriter(new FileStream(wexbimFileName, FileMode.Create));
                m3D.Write(bw);
                bw.Close();
            }
            catch (Exception ce)
            {
                Console.WriteLine("Error compiling geometry\n" + ce.Message);
            }

            model.Close();
            watch.Stop();
        }
        */

    }

    
    // Sucht ein Element mit dem angegebenen EntityLabel und gibt seine Eigenschaften zurück
    public static object[] FindElementByLabel(int entityLabel)
    {
        const string ifcFilePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/FourWallsDoorWindowsRoof.ifc";
        using (var model = IfcStore.Open(ifcFilePath))
        {
            var element = model.Instances.FirstOrDefault(e => e.EntityLabel == entityLabel);

            if (element == null)
            {
                Console.WriteLine($"Element with entity label {entityLabel} not found.");
                return null;
            }

            // Get the properties of the element
            var properties = new List<object>();
            properties.Add(element.GetType().ToString());

            if (element is IIfcWall wall) // 205, 358
            {
                properties.Add("Material: " + wall.Material);
                properties.Add("Description: " +wall.Description);
                
            }
            else if (element is IIfcDoor door) // 6546
            {
                properties.Add("OverallHeight: " + door.OverallHeight);
                properties.Add("OverallWidth: " + door.OverallWidth);
            }
            else if (element is IIfcWindow window) // 7234, 7263, 7290, 7317
            {
                properties.Add(window.Name);
                properties.Add("Description: " + window.Description);
                properties.Add("OverallHeight: " + window.OverallHeight);
                properties.Add("OverallWidth: " + window.OverallWidth);
            }
            else if (element is IIfcRoof roof) // 7340
            {
                properties.Add("Description: " +roof.Description);
                properties.Add("Name: " +roof.Name);
                
            }
            else if (element is IIfcSlab slab) // 7380
            {
                properties.Add("Description: " +slab.Description);
                properties.Add("Name: " +slab.Name);
            }
            else if (element is IIfcSite site) // 7595
            {
                properties.Add("Description: " +site.Description);
                properties.Add("Name: " +site.Name);
            }
            else if (element is IIfcBuildingStorey storey ) // 110
            {
                properties.Add("Description: " + storey.Description);
                properties.Add("Name: " + storey.Name);
                properties.Add("TotalHeigth: " + storey.TotalHeight);
                properties.Add("GrossFloorArea: " + storey.GrossFloorArea);
            }
            

            // Add the EntityLabel to the array
            properties.Add(entityLabel);
            Console.WriteLine($"Array der gefundenen Elemente: {string.Join(", ", properties)}");

            return properties.ToArray();
        }
    }
    
    public static void PrintElementsWithEntityLabels()
    {
        const string ifcFilePath = "/Users/ec61/gaeb-gateway-backend/gaeb-gateway-backend/FourWallsDoorWindowsRoof.ifc";

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


    /*
    public static void FindElementByLabell(int entityLabel)
    {
        const string fileName = "SampleHouse.ifc";
        using (var model = IfcStore.Open(fileName))
        {
            var element = model.Instances.FirstOrDefault(x => x.EntityLabel == entityLabel);
            if (element != null)
            {
                // print element properties
                Console.WriteLine($"Element type: {element.GetType()}"); // example: access IfcWall properties
                if (element is Xbim.Ifc2x3.SharedBldgElements.IfcDoor)
                {
                    Console.WriteLine((element as IIfcDoor).OverallHeight);
                    Console.WriteLine((element as IIfcDoor).OverallWidth);
                }

                if (element is Xbim.Ifc2x3.SharedBldgElements.IfcWall)
                {
                    
                }
            }
            else
            {
                Console.WriteLine($"Element with entity label {entityLabel} not found.");
            }
        }
    }
    */
    
    public static IIfcProduct[] GetWindowsDoorsAndWalls(string ifcFilePath)
    {
        var products = new List<IIfcProduct>();
        using (var model = IfcStore.Open(ifcFilePath))
        {
            var walls = model.Instances.OfType<IIfcWall>().Cast<IIfcProduct>();
            var doors = model.Instances.OfType<IIfcDoor>().Cast<IIfcProduct>();
            var windows = model.Instances.OfType<IIfcWindow>().Cast<IIfcProduct>();

            products.AddRange(walls);
            products.AddRange(doors);
            products.AddRange(windows);
        }
        foreach (var product in products)
        {
            Console.WriteLine($"Product name: {product.Name}");
        }
        
        return products.ToArray();
    }

    
    
        
    }





