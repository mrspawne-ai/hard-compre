using HardCompare.BusinessLayer.Interfaces;
using HardCompare.BusinessLayer.Structure;
using HardCompare.DataAccessLayer.Context;
using HardCompare.DataAccessLayer.Repositories;

namespace HardCompare.BusinessLayer;

public class BusinessLogic
{
    public IUserAuthAction UserAuthAction() => new UserAuthActionExecution();

    public IHardwareModelAction HardwareModelAction() =>
        new HardwareModelActionExecution(new HardwareModelRepository(new HardCompareDbContext()));

    public IContactAction ContactAction() =>
        new ContactActionExecution(new ContactRepository(new HardCompareDbContext()));

    public IFaqAction FaqAction() =>
        new FaqActionExecution(new FaqRepository(new HardCompareDbContext()));

    public IGuideAction GuideAction() =>
        new GuideActionExecution(new GuideRepository(new HardCompareDbContext()));

    public IAdminAction AdminAction() =>
        new AdminActionExecution(new HardwareModelRepository(new HardCompareDbContext()));
}
