using System;
using System.Collections.Generic;

namespace Web_Api_Shop_Polynuchka.Model;

public partial class Product
{
    public int Id { get; set; }

    public string? Name { get; set; } 

    public int Price { get; set; }

    public int? Count { get; set; }

    public int? CategoryId { get; set; }

    public virtual Category? Category { get; set; }

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
