using System;
using System.Collections.Generic;

namespace Web_Api_Shop_Polynuchka.Model;

public partial class Order
{
    public int Id { get; set; }

    public int? ProductId { get; set; }

    public int? UserId { get; set; }

    public virtual Product? Product { get; set; } 

    public virtual User? User { get; set; } 
}
