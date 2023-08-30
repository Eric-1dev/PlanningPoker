using Autofac;
using PlanningPoker.Services.Implementation;
using PlanningPoker.Services.Interfaces;

namespace PlanningPoker.IoC;

public static class IoC
{
    public static void RegisterLocalServices(this ContainerBuilder builder)
    {
        builder.RegisterType<GameControlService>()
            .As<IGameControlService>()
            .SingleInstance()
            .PropertiesAutowired();
    }
}
