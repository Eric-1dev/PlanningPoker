using System.Reflection;
using System.Text.Json.Serialization;
using Autofac;
using Autofac.Extensions.DependencyInjection;
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
    .AddControllers()
    .AddControllersAsServices()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
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

builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", builder =>
{
    builder.AllowAnyOrigin();
    builder.AllowAnyHeader();
    builder.AllowAnyMethod();
}));

var app = builder.Build();

app.UseHsts();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors("CorsPolicy");

app.MapControllers().RequireAuthorization();

app.MapHub<GameConnectHub>("/GameConnect");

app.Run();
