using System.Reflection;
using System.Text.Json.Serialization;
using Autofac;
using Autofac.Extensions.DependencyInjection;
using BundlerMinifier.TagHelpers;
using ElectroPrognizer.Utils.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PlanningPoker.FrontOffice.Security;
using PlanningPoker.IoC;
using PlanningPoker.Services.HubFilters;
using PlanningPoker.Services.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory(builder =>
{
    var controllersAssembly = Assembly.GetExecutingAssembly();
    var controllers = controllersAssembly.GetTypes().Where(type => !type.IsAbstract && type.IsPublic && type.IsAssignableTo<ControllerBase>());

    foreach (var controller in controllers)
    {
        builder.RegisterType(controller).PropertiesAutowired();
    }

    builder.RegisterLocalServices();

    builder.RegisterType<GameConnectHub>().SingleInstance().PropertiesAutowired();
    builder.RegisterType<ErrorHandleHubFilter>().As<IHubFilter>().PropertiesAutowired();
}));

var connectionString = builder.Configuration.GetConnectionString("PlanningPoker");
ConfigurationHelper.SetConnectionString(connectionString);

builder.Services
    .AddMvc()
    .AddControllersAsServices();

builder.Services
    .AddControllersWithViews()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddHttpContextAccessor();

builder.Services.AddBundles(options =>
{
    options.AppendVersion = true;
    options.UseMinifiedFiles = false;
    options.UseBundles = false;
});

builder.Services.AddAuthentication(PokerAuthenticationHandler.AuthSchemeName)
    .AddScheme<AuthenticationSchemeOptions, PokerAuthenticationHandler>(PokerAuthenticationHandler.AuthSchemeName, null, options => { });

builder.Services.AddAuthorization();

builder.Services
    .AddSignalR(options =>
    {
        options.AddFilter<ErrorHandleHubFilter>();
    })
    .AddJsonProtocol(options => options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

var app = builder.Build();

app.UseDeveloperExceptionPage();

app.UseHsts();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapControllers().RequireAuthorization();

app.MapHub<GameConnectHub>("/GameConnect");

app.Run();
