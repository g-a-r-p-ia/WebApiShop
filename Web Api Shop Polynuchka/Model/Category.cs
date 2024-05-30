using System;
using System.Collections.Generic;

namespace Web_Api_Shop_Polynuchka.Model;

public partial class Category
{
    public int Id { get; set; }

    public string Name { get; set; } = null;

    public virtual ICollection<Product> Products { get; set; } = new List<Product>();
}
