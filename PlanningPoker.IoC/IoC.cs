using Autofac;

namespace PlanningPoker.IoC;

public static class IoC
{
    public static void RegisterLocalServices(this ContainerBuilder builder)
    {
        //builder.RegisterType<ApplicationSettingsService>()
        //    .As<IApplicationSettingsService>()
        //    .SingleInstance()
        //    .PropertiesAutowired();
    }
}
