public with sharing class OpportunityReportPageController {

    @AuraEnabled
    public static List<Opportunity> getOpportunitiesServer(Map<String, String> params) {
        String budgetYear = params.get('budgetYear');
        String stageName = params.get('stageName');
        String closeDate = params.get('closeDate');

        String s = 'SELECT Id, Name, FiscalYear, Amount, StageName, Description, CloseDate ';
        String f = ' FROM Opportunity';
        String w = ' WHERE Id != NULL ';
        String o = ' ORDER BY Name ';

        if (!String.isEmpty(budgetYear) && budgetYear != 'all') {
            w += ' AND FiscalYear = ' + Integer.valueOf(budgetYear) + ' ';
        }
        if (!String.isEmpty(stageName)) {
            w += ' AND StageName = \'' + stageName + '\' ';
        }
        if (!String.isEmpty(closeDate)) {
            w += ' AND CloseDate = ' + String.valueOf(Date.valueOf(closeDate)) + ' ';
        }

        return Database.query(s + f + w + o);
    }

}
